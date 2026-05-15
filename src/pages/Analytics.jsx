import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, Cell
} from 'recharts';
import { Zap, TrendingUp, TrendingDown, Minus, Brain, Activity } from 'lucide-react';
import TopBar from '../components/TopBar';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import {
  moraleHistory as staticMorale,
  departmentActivity as staticDept,
  projects as staticProjects,
} from '../data/mockData';

const staticEngagement = [
  { week: 'W1', updates: 18, responses: 15 },
  { week: 'W2', updates: 22, responses: 19 },
  { week: 'W3', updates: 19, responses: 17 },
  { week: 'W4', updates: 25, responses: 22 },
  { week: 'W5', updates: 21, responses: 20 },
];

const staticRadar = [
  { metric: 'Delivery', value: 68 },
  { metric: 'Morale', value: 61 },
  { metric: 'Velocity', value: 74 },
  { metric: 'Quality', value: 82 },
  { metric: 'Collaboration', value: 70 },
  { metric: 'Risk Mgmt', value: 45 },
];

const staticWorkload = [
  { name: 'James Liu', load: 87 },
  { name: 'Aisha Okafor', load: 92 },
  { name: 'Elena Vasquez', load: 78 },
  { name: 'David Kim', load: 95 },
  { name: 'Tom Reyes', load: 65 },
];

const staticRecs = [
  { priority: 'Critical', color: '#ef4444', title: 'Resolve Infra Migration Blockers', desc: 'StorageClass mismatch has halted migration for 2 days. Escalate to vendor support immediately.' },
  { priority: 'High', color: '#f97316', title: 'Platform Team Morale Intervention', desc: 'Morale dropped to 42 — lowest in 5 weeks. Schedule 1:1s and consider workload redistribution.' },
  { priority: 'Medium', color: '#fbbf24', title: 'Unblock Project Orion Pipeline', desc: 'Deployment blocked 18h+. Assign dedicated resource to resolve staging auth service timeout.' },
];

function MetricCard({ label, value, change, description, color = 'var(--accent)', delay = 0 }) {
  const isUp = change > 0;
  const isNeutral = change === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl p-5 theme-transition"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</div>
        <div className="flex items-center gap-1 text-xs font-medium"
          style={{ color: isNeutral ? 'var(--text-muted)' : isUp ? 'var(--success)' : 'var(--danger)' }}>
          {isNeutral ? <Minus size={12} /> : isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isNeutral ? '—' : `${isUp ? '+' : ''}${change}%`}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</div>
    </motion.div>
  );
}

export default function Analytics() {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? '#475569' : '#94a3b8';
  const tooltipBg = theme === 'dark' ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const [overview, setOverview] = useState(null);
  const [moraleHistory, setMoraleHistory] = useState(staticMorale);
  const [radarData, setRadarData] = useState(staticRadar);
  const [riskScores, setRiskScores] = useState([]);
  const [workload, setWorkload] = useState(staticWorkload);
  const [engagement, setEngagement] = useState(staticEngagement);
  const [recommendations, setRecommendations] = useState(staticRecs);

  useEffect(() => {
    Promise.all([
      api.getAnalyticsOverview(),
      api.getMoraleHistory(),
      api.getAnalyticsRadar(),
      api.getRiskScores(),
      api.getWorkload(),
      api.getEngagement(),
      api.getRecommendations(),
    ]).then(([ov, morale, radar, risks, wl, eng, recs]) => {
      setOverview(ov);
      if (morale.moraleHistory?.length) setMoraleHistory(morale.moraleHistory);
      if (radar.radarData?.length) setRadarData(radar.radarData);
      if (risks.riskScores?.length) {
        setRiskScores(risks.riskScores.map(p => ({
          name: p.name.split(' ')[0],
          score: p.score,
          color: p.risk === 'critical' ? '#ef4444' : p.risk === 'high' ? '#f97316' : p.risk === 'medium' ? '#fbbf24' : '#34d399',
        })));
      }
      if (wl.workload?.length) setWorkload(wl.workload);
      if (eng.engagementHistory?.length) setEngagement(eng.engagementHistory);
      if (recs.recommendations?.length) setRecommendations(recs.recommendations);
    }).catch(console.error);
  }, []);

  const stats = overview || {
    orgHealthScore: 67,
    avgMorale: Math.round(staticProjects.reduce((a, p) => a + p.morale, 0) / staticProjects.length),
    totalBlockers: staticProjects.reduce((a, p) => a + p.blockers, 0),
    deliveryConfidence: 40,
  };

  const displayRiskScores = riskScores.length > 0 ? riskScores : staticProjects.map(p => ({
    name: p.name.split(' ')[0],
    score: p.risk === 'critical' ? 95 : p.risk === 'high' ? 75 : p.risk === 'medium' ? 50 : 20,
    color: p.risk === 'critical' ? '#ef4444' : p.risk === 'high' ? '#f97316' : p.risk === 'medium' ? '#fbbf24' : '#34d399',
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
        <div className="mb-1" style={{ color: axisColor }}>{label}</div>
        {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--text-primary)' }}>{p.name}: {p.value}</div>)}
      </div>
    );
  };

  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="AI Analytics" subtitle="Operational intelligence & predictive insights" />

      <div className="p-6 space-y-5">
        {/* AI header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 flex items-center gap-4 theme-transition"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>AI Operational Intelligence Engine</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Analyzing updates across all projects · Last processed 4 minutes ago ·
              <span className="ml-1 font-medium" style={{ color: 'var(--accent)' }}>3 new signals detected</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--success)' }}>
            <Activity size={12} className="animate-pulse" />
            Live
          </div>
        </motion.div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Operational Health Score" value={stats.orgHealthScore || 67} change={-5} description="Org-wide composite score" color="var(--accent)" delay={0.05} />
          <MetricCard label="Avg Team Morale" value={`${stats.avgMorale}%`} change={-8} description="Down from last week" color="#ec4899" delay={0.1} />
          <MetricCard label="Active Blockers" value={stats.totalBlockers} change={27} description="27% increase this week" color="var(--danger)" delay={0.15} />
          <MetricCard label="Delivery Confidence" value={`${stats.deliveryConfidence}%`} change={-5} description="Across all active projects" color="var(--success)" delay={0.2} />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Radar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Org Health Radar</div>
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Multi-dimensional performance</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: axisColor, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Risk scores */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Project Risk Scores</div>
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>AI-calculated risk index</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={displayRiskScores} layout="vertical" barSize={12}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Risk Score" radius={[0, 4, 4, 0]}>
                  {displayRiskScores.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Workload */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Workload Indicators</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Employee capacity utilization</div>
            <div className="space-y-3.5">
              {workload.map((emp, i) => {
                const load = emp.load || emp.projectCount * 25 || 0;
                const color = load >= 90 ? '#ef4444' : load >= 75 ? '#fbbf24' : '#34d399';
                const displayName = emp.name?.split(' ')[0] || emp.name;
                return (
                  <div key={emp.id || i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: 'var(--text-secondary)' }}>{displayName}</span>
                      <span style={{ color }} className="font-semibold">{load}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${load}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Morale trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Morale Trend Analysis</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>5-week rolling by department</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={moraleHistory}>
                <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[30, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="engineering" name="Engineering" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="product"     name="Product"     stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="platform"    name="Platform"    stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="qa"          name="QA"          stroke="#fbbf24" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              {[['Engineering', '#6366f1'], ['Product', '#34d399'], ['Platform', '#ef4444'], ['QA', '#fbbf24']].map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  {name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Engagement */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Employee Engagement</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Updates submitted vs AI responses</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={engagement}>
                <defs>
                  <linearGradient id="gUpdates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="updates"   name="Updates"      stroke="#6366f1" fill="url(#gUpdates)"   strokeWidth={2} />
                <Area type="monotone" dataKey="responses" name="AI Responses"  stroke="#a855f7" fill="url(#gResponses)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl p-5 theme-transition" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: 'var(--accent)' }} />
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Recommendations</div>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>Generated May 15, 2026</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => {
              const color = rec.color || (rec.priority === 'Critical' ? '#ef4444' : rec.priority === 'High' ? '#f97316' : '#fbbf24');
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="p-4 rounded-xl theme-transition"
                  style={{ background: `${color}08`, border: `1px solid ${color}25` }}>
                  <div className="text-xs font-semibold mb-2 px-2 py-0.5 rounded-full inline-block"
                    style={{ background: `${color}18`, color }}>
                    {rec.priority}
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{rec.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec.desc || rec.description}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
