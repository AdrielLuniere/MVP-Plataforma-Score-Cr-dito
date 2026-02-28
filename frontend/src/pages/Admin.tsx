import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  ArrowLeft,
  Save,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../services/api';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weights, setWeights] = useState({
    income: { high: 400, medium: 250, low: 100 },
    debt: { low: 300, medium: 150, critical: 0 },
    contract: { PERMANENT: 200, INDETERMINATE: 150, TEMPORARY: 50 },
    occupation: { FULL_TIME: 100, SELF_EMPLOYED: 70, FREELANCE: 50 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Admin stats failed');
        navigate('/dashboard'); // Kick back if not authorized
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSaveWeights = async () => {
    setSaving(true);
    try {
      await api.post('/admin/config-weights', weights);
      alert('Weights updated successfully!');
    } catch (err) {
      alert('Failed to update weights.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const COLORS = ['#06b6d4', '#f59e0b', '#f97316', '#ef4444'];
  const riskData = Object.entries(stats?.riskDistribution || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Control Center</h1>
              <p className="text-slate-500 text-sm">Monitor system performance and adjust internal scoring logic.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            SECURE ADMIN ACCESS
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center">
              <Users className="text-cyan-500 w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Users</span>
              <div className="text-3xl font-black text-white">{stats?.totalUsers || 0}</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Activity className="text-blue-500 w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Score</span>
              <div className="text-3xl font-black text-white">{stats?.averageScore || 0}</div>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <Settings className="text-emerald-500 w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Health</span>
              <div className="text-xl font-black text-white">OPTIMAL</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Risk Distribution Chart */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
            <h3 className="font-bold text-white mb-8 flex items-center gap-2">
              <BarChart3 className="text-cyan-500 w-5 h-5" />
              Risk Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {riskData.map((item: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</div>
                  <div className="text-lg font-black text-white">{item.value as React.ReactNode}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Weights */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Settings className="text-cyan-500 w-5 h-5" />
                Algorithm Scoring Weights
              </h3>
              <button 
                onClick={handleSaveWeights}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Income Brackets (Points)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(['high', 'medium', 'low'] as const).map(key => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] text-slate-500 capitalize">{key}</label>
                      <input 
                        type="number"
                        value={weights.income[key]}
                        onChange={(e) => setWeights({...weights, income: {...weights.income, [key]: Number(e.target.value)}})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-cyan-400 outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contract Multipliers</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(['PERMANENT', 'INDETERMINATE', 'TEMPORARY'] as const).map(key => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] text-slate-500 capitalize">{key.toLowerCase()}</label>
                      <input 
                        type="number"
                        value={weights.contract[key]}
                        onChange={(e) => setWeights({...weights, contract: {...weights.contract, [key]: Number(e.target.value)}})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-blue-400 outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
