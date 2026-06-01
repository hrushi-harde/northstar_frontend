import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban, AlertTriangle, Heart, TrendingUp,
  Ban, Zap, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

import {
  moraleHistory as staticMorale,
  projectHealthHistory as staticHealth,
  blockerDistribution as staticBlockers,
  activityFeed as staticFeed,
  departmentActivity as staticDept,
  aiInsights as staticInsights,
} from '../data/mockData';

function useChartColors() {
  const { theme } = useTheme();
  return {
    tooltipBg: theme === 'dark' ? '#1a1a2e' : '#ffffff',
    tooltipBorder: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tooltipText: theme === 'dark' ? '#94a3b8' : '#475569',
    axisColor: theme === 'dark' ? '#475569' : '#94a3b8',
    gridColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  };
}

function CustomTooltip({ active, payload, label }) {
  const { tooltipBg, tooltipBorder, tooltipText } = useChartColors();
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}>
      <div className="mb-1" style={{ color: tooltipText }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const { axisColor } = useChartColors();
  const [overview, setOverview] = useState(null);
  const [moraleHistory, setMoraleHistory] = useState(staticMorale);
  const [healthHistory, setHealthHistory] = useState(staticHealth);
  const [blockerDist, setBlockerDist] = useState(staticBlockers);
  const [deptActivity, setDeptActivity] = useState(staticDept);
  const [insights, setInsights] = useState(staticInsights);
  const [activityFeed, setActivityFeed] = useState(staticFeed);

  useEffect(() => {
    Promise.all([
      api.getAnalyticsOverview(),
      api.getMoraleHistory(),
      api.getProjectHealthHistory(),
      api.getBlockerDistribution(),
      api.getDepartmentActivity(),
      api.getInsights({ limit: 5 }),
      api.getActivityFeed({ limit: 7 }),
    ]).then(([ov, morale, health, blockers, dept, ins, feed]) => {
      setOverview(ov);
      if (morale.moraleHistory?.length) setMoraleHistory(morale.moraleHistory);
      if (health.projectHealthHistory?.length) setHealthHistory(health.projectHealthHistory);
      if (blockers.distribution?.length) setBlockerDist(blockers.distribution);
      if (dept.departmentActivity?.length) setDeptActivity(dept.departmentActivity);
      if (ins.insights?.length) setInsights(ins.insights);
      if (feed.feed?.length) setActivityFeed(feed.feed);
    }).catch(console.error);
  }, []);

  const stats = overview || {
    totalProjects: 5, activeRisks: 2, avgMorale: 65,
    deliveryConfidence: 40, blockedProjects: 1,
  };

  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };

  return (
    <div className="page-shell min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Executive Dashboard" subtitle="Organization-wide operational intelligence" />

      <div className="content-layer p-5 lg:p-6 space-y-5">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5 lg:p-6" style={{ background: 'var(--bg-glass)', boxShadow: 'var(--shadow-xl)' }}>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                <Zap size={12} /> Executive control center
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Operational clarity at a glance.</h2>
              <p className="mt-3 max-w-2xl text-sm lg:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A premium command surface for delivery risk, morale, blockers, and AI-generated executive insight.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:min-w-[22rem]">
              {[
                { label: 'Open blockers', value: stats.blockedProjects || 0, color: 'var(--danger)' },
                { label: 'Delivery confidence', value: `${stats.deliveryConfidence}%`, color: 'var(--success)' },
              ].map(item => (
                <div key={item.label} className="premium-card p-4" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                  <div className="text-2xl font-semibold" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderKanban} color="#ff6a00" trend={0} delay={0} />
          <StatCard label="Active Risks" value={stats.activeRisks} icon={AlertTriangle} color="#f97316" trend={12} delay={0.05} />
          <StatCard label="Team Morale" value={`${stats.avgMorale}%`} icon={Heart} color="#ec4899" trend={-8} delay={0.1} />
          <StatCard label="Delivery Confidence" value={`${stats.deliveryConfidence}%`} icon={TrendingUp} color="#22d3ee" trend={-5} delay={0.15} />
          <StatCard label="Blocked Projects" value={stats.blockedProjects} icon={Ban} color="#ef4444" trend={100} delay={0.2} />
        </div>

        <div className="bento-grid items-stretch">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-8" style={cardStyle}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Project Health Trend</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>5-week rolling view</div>
              </div>
              <div className="chip" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Live chart</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={healthHistory}>
                <defs>
                  <linearGradient id="gHealthy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.28} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.28} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.28} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="healthy" name="Healthy" stroke="#34d399" fill="url(#gHealthy)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="atRisk" name="At Risk" stroke="#f59e0b" fill="url(#gRisk)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="blocked" name="Blocked" stroke="#ef4444" fill="url(#gBlocked)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-4" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Blocker Distribution</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By category</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={blockerDist} cx="50%" cy="50%" innerRadius={40} outerRadius={68} dataKey="value" paddingAngle={4}>
                  {blockerDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {blockerDist.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: b.color }} /><span style={{ color: 'var(--text-secondary)' }}>{b.name}</span></div>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.value}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="bento-grid items-stretch">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-4" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Morale Trends</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By department</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={moraleHistory}>
                <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[30, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="engineering" name="Engineering" stroke="#ff6a00" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="product" name="Product" stroke="#34d399" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="platform" name="Platform" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="qa" name="QA" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-4" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Department Activity</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Updates & blockers this week</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deptActivity} barSize={12}>
                <XAxis dataKey="dept" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="updates" name="Updates" fill="#ff6a00" radius={[8, 8, 0, 0]} />
                <Bar dataKey="blockers" name="Blockers" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-4 flex flex-col" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
                <Zap size={13} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insights</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Live feed</div>
              </div>
              <span className="ml-auto chip" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>Live</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {insights.map((insight, i) => (
                <motion.div key={insight.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.07 }} className="flex gap-3 p-3 rounded-2xl theme-transition" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <span className="text-sm mt-0.5 flex-shrink-0">{insight.icon}</span>
                  <div>
                    <div className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.message}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{insight.project_name || insight.project} · {insight.time || 'recently'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="bento-grid items-stretch">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-8" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} style={{ color: 'var(--accent)' }} />
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly Operational Summary</div>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>AI Generated · May 15, 2026</span>
            </div>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>This week saw <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>increased delivery risk</span> across Engineering and Platform teams. The Infra Migration project is critically blocked with a StorageClass mismatch halting stateful service migrations.</p>
              <p><span className="font-semibold" style={{ color: 'var(--success)' }}>Positive signal:</span> Atlas Redesign is on track at 81% completion with the highest team morale score (84). Payments v3 is nearing completion at 91%.</p>
              <p><span className="font-semibold" style={{ color: 'var(--danger)' }}>Action required:</span> Platform team morale has dropped to 42, the lowest in 5 weeks. Recommend immediate 1:1s and blocker resolution support.</p>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {[
                { label: `${stats.totalBlockers || 11} total blockers`, color: '#ef4444' },
                { label: '63 updates submitted', color: '#ff6a00' },
                { label: `${stats.activeRisks || 2} critical risks`, color: '#f59e0b' },
              ].map((tag, i) => (
                <span key={i} className="chip" style={{ background: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}30` }}>{tag.label}</span>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="premium-card p-5 lg:p-6 col-span-12 xl:col-span-4" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} style={{ color: 'var(--text-muted)' }} />
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Live Activity</div>
            </div>
            <div className="space-y-3">
              {activityFeed.map((item, i) => {
                const typeColors = { update: '#ff6a00', alert: '#ef4444', blocker: '#f97316', ai: '#8b5cf6', resolved: '#34d399' };
                const color = typeColors[item.type] || '#ff6a00';
                const userName = item.user_name || item.user || 'AI';
                const projectName = item.project_name || item.project || '';
                return (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{userName}</span> {item.action}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{projectName}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
