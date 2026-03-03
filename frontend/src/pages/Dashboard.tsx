import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  RefreshCcw, 
  Wallet, 
  AlertCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get('/credit-score');
      setScoreData(response.data);
    } catch (err) {
      console.error('Failed to fetch score data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/financial/sync');
      await fetchData();
    } catch (err) {
      console.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-emerald-400';
      case 'MEDIUM': return 'text-amber-400';
      case 'HIGH': return 'text-orange-400';
      case 'VERY_HIGH': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
              Vanguard <span className="text-cyan-500">Credit</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Empowering your financial future through transparency.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 font-bold text-sm"
            >
              <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'SYNCING DATA...' : 'RE-SYNC BANKS'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* LEFT SIDEBAR - Stats & Actions */}
          <div className="xl:col-span-1 space-y-8">
            {/* Main Score Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Shield className="text-cyan-500 w-16 h-16" />
              </div>
              
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="absolute inset-4 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="112" cy="112" r="100" className="stroke-slate-800/50" strokeWidth="10" fill="transparent" />
                  <motion.circle
                    cx="112" cy="112" r="100" className="stroke-cyan-500" strokeWidth="10" fill="transparent"
                    strokeDasharray={2 * Math.PI * 100}
                    initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - (scoreData?.score || 0) / 1000) }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-7xl font-black text-white leading-none tracking-tighter">
                    {scoreData?.score || 0}
                  </motion.span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">GLOBAL SCORE</span>
                </div>
              </div>

              <div className="mt-10 text-center space-y-3 w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full bg-slate-950/80 border border-white/5 shadow-inner ${getRiskColor(scoreData?.riskLevel)}`}
                >
                  {scoreData?.riskLevel || 'ANALYZING'} RISK
                </motion.div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium mx-auto max-w-[200px]">
                  {scoreData?.score 
                    ? `Your financial health is currently rated as ${scoreData.riskLevel}.` 
                    : 'Sync your accounts for analysis.'}
                </p>
              </div>
            </motion.div>

            {/* Quick Actions / Tips */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                  <Plus className="w-10 h-10 mb-4" />
                  <h4 className="text-2xl font-black tracking-tight">Simulator</h4>
                  <p className="text-blue-100 text-xs mt-2 leading-relaxed font-medium">
                    Test financial scenarios and predict changes.
                  </p>
                  <button 
                    onClick={() => navigate('/simulator')}
                    className="mt-8 bg-white text-blue-700 font-black px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 w-full hover:gap-5 transition-all shadow-xl active:scale-95 text-xs tracking-widest uppercase"
                  >
                    Launch
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Wallet className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-white/10 rotate-12" />
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8">
                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-6 px-2">Financial Insights</h4>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0 border border-cyan-500/5">
                      <TrendingUp className="text-cyan-500 w-5 h-5" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Lowering debt-to-income below <span className="text-white">30%</span> could boost score.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/5">
                      <AlertCircle className="text-amber-500 w-5 h-5" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      Permanent contracts provide the <span className="text-white">highest</span> stability score.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="xl:col-span-3 space-y-8">
            {/* History Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 relative z-10">
                <div>
                  <h3 className="font-black text-white text-2xl tracking-tighter flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-xl">
                      <TrendingUp className="text-cyan-500 w-6 h-6" />
                    </div>
                    Performance History
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 font-medium italic opacity-70">Cross-market credit evolution tracking.</p>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-white/5 flex gap-1 shadow-inner">
                  <button className="px-6 py-2.5 text-[10px] font-black bg-slate-800 text-white rounded-xl shadow-lg">6 MONTHS</button>
                  <button className="px-6 py-2.5 text-[10px] font-black text-slate-500 hover:text-white transition-colors">1 YEAR</button>
                </div>
              </div>
              
              <div className="h-[350px] w-full relative z-10">
                {scoreData?.history?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreData?.history}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.1} />
                      <XAxis dataKey="createdAt" hide />
                      <YAxis domain={[0, 1000]} stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#06b6d4', fontSize: '14px', fontWeight: '900' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />
                      <div className="relative w-24 h-24 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-slate-700" />
                      </div>
                    </div>
                    <h4 className="text-slate-400 font-black text-sm uppercase tracking-widest">No metrics detected</h4>
                    <p className="text-slate-600 text-[11px] mt-2 max-w-[200px] font-medium leading-relaxed">
                      Initialize banking sync to begin historical charting.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Impact Factors */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter">Impact Analysis</h3>
                  <p className="text-slate-500 text-[11px] font-medium uppercase tracking-widest mt-1 opacity-40 italic">Vanguard Engine v1.0.4</p>
                </div>
                <div className="h-px flex-1 bg-white/5 mx-8 hidden sm:block" />
                <span className="text-[10px] font-black text-slate-600 bg-slate-900/50 px-4 py-1.5 rounded-full border border-white/5">SECURE SCAN</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Positive Factors */}
                <div className="bg-emerald-500/[0.02] backdrop-blur-sm border border-emerald-500/10 rounded-[40px] p-10 space-y-8 hover:bg-emerald-500/[0.04] transition-all shadow-xl group/card">
                  <div className="flex items-center gap-4 text-emerald-400 font-black text-[10px] tracking-[0.3em] uppercase">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover/card:scale-110 transition-transform"><TrendingUp className="w-6 h-6" /></div>
                    Momentum
                  </div>
                  <div className="space-y-5">
                    {(scoreData?.factors?.positive && scoreData.factors.positive.length > 0) ? scoreData.factors.positive.map((factor: string, i: number) => (
                      <div key={i} className="flex items-start gap-5 bg-slate-950/40 p-6 rounded-[24px] border border-white/5 hover:border-emerald-500/30 transition-all shadow-inner">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5 mt-1 shrink-0 bg-emerald-500/10 rounded-full p-0.5" />
                        <span className="text-[13px] text-slate-200 font-bold leading-relaxed">{factor}</span>
                      </div>
                    )) : (
                      <div className="text-center py-12 px-6 bg-slate-950/20 rounded-[32px] border border-dashed border-slate-800 opacity-40">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Awaiting synchronization.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Negative Factors */}
                <div className="bg-red-500/[0.02] backdrop-blur-sm border border-red-500/10 rounded-[40px] p-10 space-y-8 hover:bg-red-500/[0.04] transition-all shadow-xl group/card">
                  <div className="flex items-center gap-4 text-red-500 font-black text-[10px] tracking-[0.3em] uppercase">
                    <div className="p-3 bg-red-500/10 rounded-2xl group-hover/card:scale-110 transition-transform"><TrendingDown className="w-6 h-6" /></div>
                    Friction
                  </div>
                  <div className="space-y-5">
                    {(scoreData?.factors?.negative && scoreData.factors.negative.length > 0) ? scoreData.factors.negative.map((factor: string, i: number) => (
                      <div key={i} className="flex items-start gap-5 bg-slate-950/40 p-6 rounded-[24px] border border-white/5 hover:border-red-500/30 transition-all shadow-inner">
                        <AlertCircle className="text-red-500 w-5 h-5 mt-1 shrink-0 bg-red-500/10 rounded-full p-0.5" />
                        <span className="text-[13px] text-slate-200 font-bold leading-relaxed">{factor}</span>
                      </div>
                    )) : (
                      <div className="text-center py-12 px-6 bg-slate-950/20 rounded-[32px] border border-dashed border-slate-800 opacity-40">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">No stressors found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple ArrowRight icon for the button since it wasn't imported from Lucide in the first line
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);

export default Dashboard;
