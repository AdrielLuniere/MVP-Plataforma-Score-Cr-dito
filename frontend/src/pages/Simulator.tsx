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
  
  const [values, setValues] = useState({
    income: 3000,
    monthlyExpenses: 1200,
    totalDebt: 5000,
    employmentType: 'FULL_TIME',
    contractType: 'PERMANENT'
  });

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await api.post('/credit-score/simulate', values);
      setResult(response.data);
    } catch (err) {
      console.error('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Score Simulator</h1>
            <p className="text-slate-500 text-sm">Predict how your financial changes impact your credit score.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-500" />
              Adjust Variables
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Monthly Income</span>
                  <span className="text-cyan-400">€{values.income}</span>
                </div>
                <input 
                  type="range" min="0" max="10000" step="100"
                  value={values.income}
                  onChange={(e) => setValues({...values, income: Number(e.target.value)})}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Monthly Expenses</span>
                  <span className="text-red-400">€{values.monthlyExpenses}</span>
                </div>
                <input 
                  type="range" min="0" max="5000" step="50"
                  value={values.monthlyExpenses}
                  onChange={(e) => setValues({...values, monthlyExpenses: Number(e.target.value)})}
                  className="w-full accent-red-500/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Total Debt</span>
                  <span className="text-orange-400">€{values.totalDebt}</span>
                </div>
                <input 
                  type="range" min="0" max="50000" step="500"
                  value={values.totalDebt}
                  onChange={(e) => setValues({...values, totalDebt: Number(e.target.value)})}
                  className="w-full accent-orange-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Employment</label>
                  <select 
                    value={values.employmentType}
                    onChange={(e) => setValues({...values, employmentType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500/50"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Contract</label>
                  <select 
                    value={values.contractType}
                    onChange={(e) => setValues({...values, contractType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500/50"
                  >
                    <option value="PERMANENT">Permanent</option>
                    <option value="TEMPORARY">Temporary</option>
                    <option value="INDETERMINATE">Indeterminate</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'CALCULATING...' : 'RUN SIMULATION'}
            </button>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-6">
            {!result ? (
              <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/10">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                  <Info className="text-slate-600 w-8 h-8" />
                </div>
                <h4 className="text-slate-400 font-bold">Waiting for simulation</h4>
                <p className="text-slate-600 text-xs mt-2 max-w-[200px]">
                  Adjust the values and click the button to see the results.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 space-y-8"
              >
                <div className="text-center">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Simulated Score</h4>
                  <div className="text-6xl font-black text-cyan-400">{result.score}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 text-center">
                    <span className="block text-[8px] font-bold text-slate-600 uppercase mb-1">Impact</span>
                    <span className="text-lg font-bold text-emerald-400">+{result.score - 500} pts</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 text-center">
                    <span className="block text-[8px] font-bold text-slate-600 uppercase mb-1">Status</span>
                    <span className="text-sm font-bold text-slate-300">FEASIBLE</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase">Analysis breakdown</h5>
                  <div className="space-y-2">
                    {result.factors.positive.map((f: string, i: number) => (
                      <div key={i} className="flex gap-2 text-[11px] text-emerald-400 bg-emerald-500/5 p-2 rounded-lg items-center">
                        <TrendingUp className="w-3 h-3" />
                        {f}
                      </div>
                    ))}
                    {result.factors.negative.map((f: string, i: number) => (
                      <div key={i} className="flex gap-2 text-[11px] text-red-400 bg-red-500/5 p-2 rounded-lg items-center">
                        <AlertTriangle className="w-3 h-3" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="flex gap-4">
                <DollarSign className="text-cyan-500 w-8 h-8" />
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-white">Smart Tip</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Increasing your income while maintaining your current debt levels could trigger an automatic score upgrade in our next cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Simulator;
