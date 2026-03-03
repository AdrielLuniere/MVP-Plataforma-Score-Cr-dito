import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calculator, 
  TrendingUp, 
  Info,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Simulator: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [values, setValues] = useState({
    income: 3000,
    monthlyExpenses: 1200,
    totalDebt: 5000,
    employmentType: 'FULL_TIME',
    contractType: 'PERMANENT'
  });

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/credit-score/simulate', values);
      setResult(response.data);
    } catch (err: any) {
      setError('Simulation failed. Please try again.');
      console.error('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-4 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-cyan-500/50 transition-all group shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-500 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Score <span className="text-cyan-500">Simulator</span></h1>
            <p className="text-slate-500 font-medium italic mt-1">Experiment with financial scenarios and see your potential future.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Controls - Left Side */}
          <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
            <h3 className="font-black text-white flex items-center gap-3 text-lg uppercase tracking-wider">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Calculator className="w-6 h-6 text-cyan-500" />
              </div>
              Variable Adjustments
            </h3>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span>Monthly Income</span>
                  <span className="text-cyan-400 font-black">€{values.income.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="10000" step="100"
                  value={values.income}
                  onChange={(e) => setValues({...values, income: Number(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span>Monthly Expenses</span>
                  <span className="text-red-400 font-black">€{values.monthlyExpenses.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="5000" step="50"
                  value={values.monthlyExpenses}
                  onChange={(e) => setValues({...values, monthlyExpenses: Number(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span>Total Debt</span>
                  <span className="text-orange-400 font-black">€{values.totalDebt.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="50000" step="500"
                  value={values.totalDebt}
                  onChange={(e) => setValues({...values, totalDebt: Number(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Employment</label>
                  <select 
                    value={values.employmentType}
                    onChange={(e) => setValues({...values, employmentType: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contract</label>
                  <select 
                    value={values.contractType}
                    onChange={(e) => setValues({...values, contractType: e.target.value})}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    <option value="PERMANENT">Permanent</option>
                    <option value="TEMPORARY">Temporary</option>
                    <option value="INDETERMINATE">Indeterminate</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold p-4 rounded-2xl text-center">
                {error}
              </div>
            )}

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-[24px] transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 tracking-widest text-sm"
            >
              {loading ? 'CALCULATING GENIUS...' : 'RUN SIMULATION'}
            </button>
          </div>

          {/* Results - Right Side */}
          <div className="lg:col-span-7 flex flex-col gap-8 h-full">
            {!result ? (
              <div className="flex-1 min-h-[400px] border-2 border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center p-12 text-center bg-slate-900/10 backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                  <div className="relative w-24 h-24 bg-slate-900 border border-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                    <Info className="text-cyan-500 w-10 h-10 animate-bounce" />
                  </div>
                </div>
                <h4 className="text-white text-xl font-black tracking-tight">Ready for analysis?</h4>
                <p className="text-slate-500 text-sm mt-3 max-w-[300px] leading-relaxed font-medium">
                  Adjust the sliders on the left and hit the simulation button to see the magic happen.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 space-y-10 shadow-3xl overflow-hidden relative"
              >
                {/* Score Header */}
                <div className="text-center relative py-6">
                  <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full" />
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Simulated Forecast</h4>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500 tracking-tighter"
                  >
                    {result.score}
                  </motion.div>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-1 shadow-inner">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Projected Impact</span>
                    <span className={`text-2xl font-black ${result.score > 500 ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {result.score > 500 ? '+' : ''}{result.score - 500} pts
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-1 shadow-inner">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lending Status</span>
                    <span className="text-lg font-black text-slate-200">
                      {result.score >= 700 ? 'PRE-APPROVED' : (result.score >= 400 ? 'EVALUATION REQ.' : 'HIGH RISK')}
                    </span>
                  </div>
                </div>

                {/* Factors */}
                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    Forecast Analysis
                    <div className="flex-1 h-px bg-slate-800" />
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    {result.factors.positive.map((f: string, i: number) => (
                      <div key={i} className="flex gap-4 text-sm text-emerald-300 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 items-center">
                        <TrendingUp className="w-5 h-5 shrink-0" />
                        <span className="font-semibold">{f}</span>
                      </div>
                    ))}
                    {result.factors.negative.map((f: string, i: number) => (
                      <div key={i} className="flex gap-4 text-sm text-red-300 bg-red-500/5 p-5 rounded-2xl border border-red-500/10 items-center">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span className="font-semibold">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Smart Tip Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-xl"
            >
              <div className="flex gap-6 items-start relative z-10">
                <div className="w-14 h-14 bg-cyan-600/10 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <DollarSign className="text-cyan-400 w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-black text-white tracking-tight">Smart Strategy Tip</h5>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                    Our algorithm rewards stability. Increasing your <span className="text-white">Monthly Income</span> while maintaining your current debt levels could trigger an automatic score upgrade in our next cycle.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Internal ArrowRight or other icons can go here if needed
export default Simulator;
