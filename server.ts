import express, { type Request } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const emailTransporter =
  process.env.EMAIL_HOST_USER && process.env.EMAIL_HOST_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      })
    : null;

type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
};

type CheckoutItem = {
  productId: string;
  quantity: number;
};

app.use(express.json());

function getAccessToken(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

async function getAuthenticatedUser(req: Request) {
  const accessToken = getAccessToken(req);
  if (!accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;

  return data.user;
}

function buildCheckoutReference() {
  return `EKOAPP-${Date.now().toString(36).toUpperCase()}`;
}

function normalizeRetailPrice(value: unknown) {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return 0;
  return numericValue < 1000 ? numericValue * 100 : numericValue;
}

function normalizeCheckoutItems(items: unknown): CheckoutItem[] {
  if (!Array.isArray(items)) return [];

  const mergedItems = new Map<string, number>();

  for (const item of items) {
    const productId = String((item as CheckoutItem | undefined)?.productId || "").trim();
    const quantity = Number((item as CheckoutItem | undefined)?.quantity || 0);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) continue;

    mergedItems.set(productId, (mergedItems.get(productId) || 0) + quantity);
  }

  return Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

async function createOrderBundle(userId: string, item: CheckoutItem) {
  const normalizedQuantity = Number(item.quantity);

  if (!item.productId || !Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
    throw new Error("A valid product and quantity are required.");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", item.productId)
    .single();

  if (productError || !product) {
    throw new Error("Product not found.");
  }

  const totalPrice = normalizeRetailPrice(product.base_price) * normalizedQuantity;
  const co2Saved = Number(product.co2_factor) * normalizedQuantity;
  const wasteDiverted = Number(product.waste_factor) * normalizedQuantity;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      product_id: item.productId,
      quantity: normalizedQuantity,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (orderError || !order) throw orderError || new Error("Unable to create order.");

  const { data: tree, error: treeError } = await supabase
    .from("trees")
    .insert({
      user_id: userId,
      location: "Agra Reforest Zone B-12",
      status: "seed",
    })
    .select()
    .single();

  if (treeError) throw treeError;

  const { error: impactError } = await supabase.from("esg_records").insert({
    order_id: order.id,
    user_id: userId,
    co2_saved_kg: co2Saved,
    waste_diverted_kg: wasteDiverted,
    tree_id: tree?.id ?? null,
  });

  if (impactError) throw impactError;

  const creditsEarned = co2Saved / 1000;
  const { error: ledgerError } = await supabase.from("carbon_ledger").insert({
    user_id: userId,
    credits_earned: creditsEarned,
    source_order_id: order.id,
  });

  if (ledgerError) throw ledgerError;

  return {
    orderId: String(order.id),
    product: {
      id: String(product.id),
      name: String(product.name),
      category: String(product.category ?? "Collection"),
    },
    quantity: normalizedQuantity,
    totalPrice,
    impact: {
      co2Saved,
      wasteDiverted,
      creditsEarned,
    },
  };
}

async function sendOrderNotificationEmail(payload: {
  checkoutReference: string;
  customer: CheckoutCustomer;
  authUser: { id: string; email: string | null; name: string };
  items: Awaited<ReturnType<typeof createOrderBundle>>[];
}) {
  if (!emailTransporter || !notificationEmail) {
    return { delivered: false, reason: "Email transport not configured." };
  }

  const totalAmount = payload.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCo2 = payload.items.reduce((sum, item) => sum + item.impact.co2Saved, 0);
  const totalWaste = payload.items.reduce((sum, item) => sum + item.impact.wasteDiverted, 0);
  const totalCredits = payload.items.reduce((sum, item) => sum + item.impact.creditsEarned, 0);

  const itemLines = payload.items
    .map(
      (item) =>
        `${item.product.name} | ${item.product.category} | Qty ${item.quantity} | INR ${item.totalPrice.toFixed(2)} | CO2 ${item.impact.co2Saved.toFixed(2)}kg | Waste ${item.impact.wasteDiverted.toFixed(2)}kg`
    )
    .join("\n");

  await emailTransporter.sendMail({
    from: process.env.EMAIL_HOST_USER,
    to: notificationEmail,
    subject: `New EkoKintsugi Order ${payload.checkoutReference}`,
    text: [
      "New EkoKintsugi Order Received",
      `Checkout reference: ${payload.checkoutReference}`,
      "",
      "Customer",
      `Name: ${payload.customer.fullName}`,
      `Email: ${payload.customer.email}`,
      `Phone: ${payload.customer.phone || "-"}`,
      `Address: ${payload.customer.shippingAddress}`,
      `City: ${payload.customer.city || "-"}`,
      `State: ${payload.customer.state || "-"}`,
      `Postal Code: ${payload.customer.postalCode || "-"}`,
      `Country: ${payload.customer.country || "-"}`,
      `Notes: ${payload.customer.notes || "-"}`,
      "",
      "Account",
      `User ID: ${payload.authUser.id}`,
      `Auth Email: ${payload.authUser.email || "-"}`,
      `Display Name: ${payload.authUser.name}`,
      "",
      "Items",
      itemLines,
      "",
      "Impact Summary",
      `Total Amount: INR ${totalAmount.toFixed(2)}`,
      `Total CO2 Saved: ${totalCo2.toFixed(2)} kg`,
      `Total Waste Diverted: ${totalWaste.toFixed(2)} kg`,
      `Total Carbon Credits: ${totalCredits.toFixed(4)}`,
    ].join("\n"),
  });

  return { delivered: true };
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    supabase: supabaseUrl ? "configured" : "pending",
    email: emailTransporter && notificationEmail ? "configured" : "pending",
  });
});

app.post("/api/orders/checkout", async (req, res) => {
  const authUser = await getAuthenticatedUser(req);
  const { items, customer } = req.body ?? {};
  const normalizedItems = normalizeCheckoutItems(items);

  if (!authUser) {
    return res.status(401).json({ error: "Please sign in to complete checkout." });
  }

  if (normalizedItems.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const normalizedCustomer: CheckoutCustomer = {
    fullName: String(customer?.fullName || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Member").trim(),
    email: String(customer?.email || authUser.email || "").trim().toLowerCase(),
    phone: customer?.phone ? String(customer.phone).trim() : "",
    shippingAddress: String(customer?.shippingAddress || "").trim(),
    city: customer?.city ? String(customer.city).trim() : "",
    state: customer?.state ? String(customer.state).trim() : "",
    postalCode: customer?.postalCode ? String(customer.postalCode).trim() : "",
    country: customer?.country ? String(customer.country).trim() : "",
    notes: customer?.notes ? String(customer.notes).trim() : "",
  };

  if (!normalizedCustomer.email || !normalizedCustomer.shippingAddress) {
    return res.status(400).json({ error: "Customer email and shipping address are required." });
  }

  try {
    const checkoutReference = buildCheckoutReference();
    const createdItems: Awaited<ReturnType<typeof createOrderBundle>>[] = [];

    for (const item of normalizedItems) {
      createdItems.push(await createOrderBundle(authUser.id, item));
    }

    let emailResult: { delivered: boolean; reason?: string } = { delivered: false, reason: "Email notification not attempted." };

    try {
      emailResult = await sendOrderNotificationEmail({
        checkoutReference,
        customer: normalizedCustomer,
        authUser: {
          id: authUser.id,
          email: authUser.email,
          name: String(authUser.user_metadata?.name || authUser.email?.split("@")[0] || "Member"),
        },
        items: createdItems,
      });
    } catch (emailError: any) {
      emailResult = {
        delivered: false,
        reason: emailError?.message || "Email notification failed after order creation.",
      };
      console.error("Order email error:", emailError?.message || emailError);
    }

    res.json({
      success: true,
      checkoutReference,
      orderIds: createdItems.map((item) => item.orderId),
      summary: {
        totalAmount: createdItems.reduce((sum, item) => sum + item.totalPrice, 0),
        totalCo2Saved: createdItems.reduce((sum, item) => sum + item.impact.co2Saved, 0),
        totalWasteDiverted: createdItems.reduce((sum, item) => sum + item.impact.wasteDiverted, 0),
        totalCreditsEarned: createdItems.reduce((sum, item) => sum + item.impact.creditsEarned, 0),
      },
      email: emailResult,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Checkout failed." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EkoKintsugi App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
