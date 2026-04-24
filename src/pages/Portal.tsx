import { motion } from 'motion/react';
import { Factory, Package, Truck, ShieldCheck, Download, Plus, Search, ArrowUpRight, Globe, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { analyzeMaterialScrap } from '../services/geminiService';

export default function Portal() {
  const [activeTab, setActiveTab] = useState<'Manufacturer' | 'Admin' | 'EU Distribution'>('Manufacturer');
  const [scrapDesc, setScrapDesc] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!scrapDesc) return;
    setIsAnalyzing(true);
    const result = await analyzeMaterialScrap(scrapDesc);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-serif font-bold text-ink mb-4">EkoKintsugi OS</h1>
          <p className="text-olive/60">The circular economy operating system for footwear.</p>
        </div>
        
        <div className="flex bg-beige p-1 rounded-2xl border border-olive/10">
          {['Manufacturer', 'Admin', 'EU Distribution'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-white text-olive shadow-sm" 
                  : "text-olive/40 hover:text-olive/70"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Manufacturer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scrap Intake */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-olive/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif font-bold text-ink">Scrap Intake Logging</h3>
                <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-olive transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Batch</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-olive/5 text-[10px] font-bold uppercase tracking-widest text-olive/40">
                      <th className="pb-4">Batch ID</th>
                      <th className="pb-4">Source</th>
                      <th className="pb-4">Weight (kg)</th>
                      <th className="pb-4">Grade</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { id: 'SC-2026-001', source: 'Kolkata Tannery', weight: 450, grade: 'A', status: 'Processing' },
                      { id: 'SC-2026-002', source: 'Chennai Hub', weight: 1200, grade: 'B', status: 'Validated' },
                      { id: 'SC-2026-003', source: 'Agra Factory', weight: 800, grade: 'A', status: 'Sheet Conversion' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-olive/5 last:border-0">
                        <td className="py-4 font-mono text-xs">{row.id}</td>
                        <td className="py-4 text-olive">{row.source}</td>
                        <td className="py-4 font-medium text-ink">{row.weight}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded bg-olive/5 text-olive text-[10px] font-bold">{row.grade}</span>
                        </td>
                        <td className="py-4">
                          <span className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            <span className="text-xs font-medium text-olive/70">{row.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production Tracking */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-olive/5 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-ink mb-8">Production Pipeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Stitching', count: 145, icon: Factory },
                  { label: 'Lasting', count: 82, icon: Package },
                  { label: 'QC Check', count: 34, icon: ShieldCheck },
                  { label: 'Dispatch', count: 12, icon: Truck },
                ].map((step, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-beige/30 border border-olive/5 text-center">
                    <step.icon className="w-6 h-6 text-olive mx-auto mb-4" />
                    <p className="text-2xl font-serif font-bold text-ink mb-1">{step.count}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-olive/40">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Intelligence Sidebar */}
          <div className="space-y-8">
            <div className="bg-ink text-beige p-8 rounded-[2.5rem]">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-5 h-5 text-gold" />
                <h4 className="text-xl font-serif font-bold text-gold">Material AI</h4>
              </div>
              
              <div className="space-y-4 mb-8">
                <textarea
                  value={scrapDesc}
                  onChange={(e) => setScrapDesc(e.target.value)}
                  placeholder="Describe scrap material (e.g. 50kg off-cuts from Italian calf leather...)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-beige placeholder:text-beige/20 focus:outline-none focus:border-gold/50 min-h-[100px]"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-gold text-ink font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-beige transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Scrap'}</span>
                </button>
              </div>

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-white/5 border border-gold/30 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-beige/40">Grade</span>
                    <span className="text-sm font-bold text-gold">{analysis.Grade || analysis.grade}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-beige/40">Recommendation</span>
                    <span className="text-sm font-bold text-beige">{analysis.Recommended_use || analysis.recommended_use}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-beige/40">CO₂ Potential</span>
                    <span className="text-sm font-bold text-green-400">{analysis.Estimated_CO2_saving_potential_per_kg || analysis.co2_potential}</span>
                  </div>
                </motion.div>
              )}

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                    <span>Sheet Conversion Efficiency</span>
                    <span className="text-gold">94.2%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[94.2%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                    <span>Recycled Content Avg</span>
                    <span className="text-gold">62.5%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[62.5%]" />
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-beige/50 leading-relaxed italic">
                  "AI optimization has reduced material waste by 12% in the current batch cycle."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Admin' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-olive/5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-olive/40 mb-2">Total Revenue (YTD)</p>
              <p className="text-4xl font-serif font-bold text-ink mb-4">₹4.2 Cr</p>
              <div className="flex items-center text-green-600 text-xs font-bold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+24% vs Prev Quarter</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-olive/5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-olive/40 mb-2">Customer Acquisition Cost</p>
              <p className="text-4xl font-serif font-bold text-ink mb-4">₹1,450</p>
              <div className="flex items-center text-olive/40 text-xs font-bold">
                <span>Target: ₹1,200</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-olive/5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-olive/40 mb-2">Buyback Rate</p>
              <p className="text-4xl font-serif font-bold text-ink mb-4">18.2%</p>
              <div className="flex items-center text-gold text-xs font-bold">
                <span>Circular Loop Healthy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EU Distribution' && (
        <div className="bg-white p-12 rounded-[3rem] border border-olive/5 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h3 className="text-3xl font-serif font-bold text-ink mb-2">EU Export Management</h3>
              <p className="text-olive/60">Inventory sync with Germany warehouse (Maddox Partnership).</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-beige text-olive rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-olive hover:text-beige transition-all">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-ink text-beige rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-olive transition-all">
                <Truck className="w-4 h-4" />
                <span>Sync Inventory</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-olive/40">Wholesale Validation</h4>
              <div className="p-6 rounded-2xl bg-beige/30 border border-olive/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-olive">Origin Series (€200)</span>
                  <span className="text-sm font-bold text-ink">450 Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-olive">Regen Series (€270)</span>
                  <span className="text-sm font-bold text-ink">320 Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-olive">Infinite Series (€350)</span>
                  <span className="text-sm font-bold text-ink">180 Units</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-olive/40">Recent Shipments</h4>
              <div className="space-y-4">
                {[
                  { id: 'EXP-DE-992', dest: 'Hamburg, DE', date: '2026-04-05', status: 'In Transit' },
                  { id: 'EXP-FR-102', dest: 'Paris, FR', date: '2026-04-02', status: 'Delivered' },
                ].map((ship, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-olive/5 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-olive/5 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-olive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">{ship.id}</p>
                        <p className="text-xs text-olive/40">{ship.dest} • {ship.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-olive/60">{ship.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
