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
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Executive Dashboard" subtitle="Organization-wide operational intelligence" />

      <div className="p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Projects"      value={stats.totalProjects}            icon={FolderKanban}  color="#6366f1" trend={0}   delay={0} />
          <StatCard label="Active Risks"        value={stats.activeRisks}              icon={AlertTriangle} color="#f97316" trend={12}  delay={0.05} />
          <StatCard label="Team Morale"         value={`${stats.avgMorale}%`}          icon={Heart}         color="#ec4899" trend={-8}  delay={0.1} />
          <StatCard label="Delivery Confidence" value={`${stats.deliveryConfidence}%`} icon={TrendingUp}    color="#22d3ee" trend={-5}  delay={0.15} />
          <StatCard label="Blocked Projects"    value={stats.blockedProjects}          icon={Ban}           color="#ef4444" trend={100} delay={0.2} />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Project health trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="lg:col-span-2 rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="mb-4">
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Project Health Trend</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>5-week rolling view</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={healthHistory}>
                <defs>
                  <linearGradient id="gHealthy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} /><stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="healthy"  name="Healthy"  stroke="#34d399" fill="url(#gHealthy)"  strokeWidth={2} />
                <Area type="monotone" dataKey="atRisk"   name="At Risk"  stroke="#fbbf24" fill="url(#gRisk)"    strokeWidth={2} />
                <Area type="monotone" dataKey="blocked"  name="Blocked"  stroke="#ef4444" fill="url(#gBlocked)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Blocker distribution */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Blocker Distribution</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By category</div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={blockerDist} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                  {blockerDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {blockerDist.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{b.name}</span>
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Morale trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Morale Trends</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>By department</div>
            <ResponsiveContainer width="100%" height={160}>
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
          </motion.div>

          {/* Department activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Department Activity</div>
            <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Updates & blockers this week</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={deptActivity} barSize={10}>
                <XAxis dataKey="dept" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="updates"  name="Updates"  fill="#6366f1" radius={[3,3,0,0]} />
                <Bar dataKey="blockers" name="Blockers" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-xl p-5 flex flex-col theme-transition" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
                <Zap size={12} className="text-white" />
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insights</div>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Live</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {insights.map((insight, i) => (
                <motion.div key={insight.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex gap-2.5 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}>
                  <span className="text-sm mt-0.5 flex-shrink-0">{insight.icon}</span>
                  <div>
                    <div className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.message}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {insight.project_name || insight.project} · {insight.time || 'recently'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Weekly summary + Activity feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="lg:col-span-2 rounded-xl p-5 theme-transition"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} style={{ color: 'var(--accent)' }} />
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly Operational Summary</div>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>AI Generated · May 15, 2026</span>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This week saw <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>increased delivery risk</span> across Engineering and Platform teams.
              The Infra Migration project is critically blocked with a StorageClass mismatch halting all stateful service migrations.
              Project Orion's deployment pipeline has been down for 18+ hours, affecting 2 engineers.
            </div>
            <div className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>Positive signal:</span> Atlas Redesign is on track at 81% completion with the highest team morale score (84).
              Payments v3 is nearing completion at 91%.
            </div>
            <div className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--danger)' }}>Action required:</span> Platform team morale has dropped to 42 — lowest in 5 weeks.
              Recommend immediate 1:1s and blocker resolution support.
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {[
                { label: `${stats.totalBlockers || 11} total blockers`, color: '#ef4444' },
                { label: '63 updates submitted', color: '#6366f1' },
                { label: `${stats.activeRisks || 2} critical risks`, color: '#f97316' },
              ].map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}30` }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Activity feed */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="rounded-xl p-5 theme-transition" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} style={{ color: 'var(--text-muted)' }} />
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Live Activity</div>
            </div>
            <div className="space-y-3">
              {activityFeed.map((item, i) => {
                const typeColors = { update: '#6366f1', alert: '#ef4444', blocker: '#f97316', ai: '#a855f7', resolved: '#34d399' };
                const color = typeColors[item.type] || '#6366f1';
                const userName = item.user_name || item.user || 'AI';
                const projectName = item.project_name || item.project || '';
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                    <div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{userName}</span> {item.action}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{projectName}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
