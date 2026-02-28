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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Financial Health</h1>
            <p className="text-slate-500 mt-1">Real-time credit analysis and insights.</p>
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-6 py-3 rounded-2xl transition-all shadow-xl disabled:opacity-50 group"
          >
            <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="text-sm font-semibold">{syncing ? 'Syncing Banks...' : 'Sync via Open Banking'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <Shield className="text-cyan-500/20 w-12 h-12" />
            </div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-cyan-500"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - (scoreData?.score || 0) / 1000) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{scoreData?.score || 0}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">OF 1000</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className={`text-sm font-black uppercase tracking-widest ${getRiskColor(scoreData?.riskLevel)}`}>
                {scoreData?.riskLevel || 'ANALYZING'} RISK
              </div>
              <p className="text-slate-400 text-xs mt-2 px-4">
                Your score is considered {scoreData?.riskLevel === 'LOW' ? 'Excellent' : 'Average'} 
                based on EU financial standards.
              </p>
            </div>
          </motion.div>

          {/* History Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-cyan-500 w-5 h-5" />
                Score Evolution
              </h3>
              <select className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500/50">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData?.history || []}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="createdAt" 
                    hide 
                  />
                  <YAxis 
                    domain={[0, 1000]} 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Impact Factors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-xl font-bold text-white px-2">Key Impact Factors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Positive Factors */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  POSITIVE IMPACTS
                </div>
                <div className="space-y-3">
                  {scoreData?.factors?.positive.map((factor: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-2xl border border-emerald-500/5">
                      <CheckCircle2 className="text-emerald-500 w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">{factor}</span>
                    </div>
                  ))}
                  {scoreData?.factors?.positive.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No significant positive factors found.</span>
                  )}
                </div>
              </div>

              {/* Negative Factors */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <TrendingDown className="w-4 h-4" />
                  AREAS FOR IMPROVEMENT
                </div>
                <div className="space-y-3">
                  {scoreData?.factors?.negative.map((factor: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-2xl border border-red-500/5">
                      <AlertCircle className="text-red-500 w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">{factor}</span>
                    </div>
                  ))}
                  {scoreData?.factors?.negative.length === 0 && (
                    <span className="text-xs text-slate-500 italic">Great! No major negative factors affecting your score.</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions / Tips */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Plus className="w-10 h-10 mb-4" />
                <h4 className="text-xl font-bold">Try the Simulator</h4>
                <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                  Project your score by changing variables like income or debt.
                </p>
                <button 
                  onClick={() => navigate('/simulator')}
                  className="mt-6 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg active:scale-95"
                >
                  Launch Simulator
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Wallet className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-white/10 rotate-12" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h4 className="font-bold text-white text-sm mb-4">Financial Insights</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="text-cyan-500 w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Reducing your debt-to-income ratio below 30% could boost your score by up to 50 points.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <AlertCircle className="text-amber-500 w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Permanent contracts are valued 2x higher for stability scoring.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

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
