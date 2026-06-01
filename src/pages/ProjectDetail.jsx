import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, AlertTriangle, Zap, Clock, Calendar, RefreshCw, TrendingUp, TrendingDown, Activity, Shield, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TopBar from '../components/TopBar';
import HealthBadge from '../components/HealthBadge';
import RiskBadge from '../components/RiskBadge';
import ProgressBar from '../components/ProgressBar';
import { api } from '../api/client';
import { projects as staticProjects } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const fallbackHistory = [
  { week: 'W1', progress: 20 },
  { week: 'W2', progress: 35 },
  { week: 'W3', progress: 48 },
  { week: 'W4', progress: 55 },
  { week: 'W5', progress: 62 },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const axisColor = theme === 'dark' ? '#475569' : '#94a3b8';
  const tooltipBg = theme === 'dark' ? '#1a1a2e' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getProject(id)
      .then(d => setProject(d.project))
      .catch(() => {
        const mock = staticProjects.find(p => p.id === id) || staticProjects[0];
        setProject({
          ...mock,
          manager: { id: mock.manager, name: 'Marcus Webb', avatar: 'MW', title: 'Engineering Manager' },
          team: mock.team.map(uid => ({ id: uid, name: uid, avatar: uid.toUpperCase(), title: 'Engineer' })),
          blockerList: [],
          insights: [],
          progressHistory: fallbackHistory,
        });
        setError('Using cached data');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-transition" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--accent-soft)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 theme-transition" style={{ background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--text-muted)' }}>Project not found</div>
        <button onClick={() => navigate('/projects')} className="text-sm" style={{ color: 'var(--accent)' }}>
          ← Back to Projects
        </button>
      </div>
    );
  }

  const progressHistory = project.progressHistory?.length ? project.progressHistory : fallbackHistory;
  const teamMembers = project.team || [];
  const manager = project.manager;
  const blockerList = project.blockerList || [];
  const insights = project.insights || [];

  const severityColor = { low: '#fbbf24', medium: '#f97316', high: '#ef4444', critical: '#dc2626' };
  const statusColor = { open: '#ef4444', 'in-progress': '#f97316', resolved: '#34d399' };
  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };

  async function resolveBlocker(blockerId) {
    setResolvingId(blockerId);
    try {
      await api.updateBlocker(blockerId, { status: 'resolved' });
      // Refresh project data
      const d = await api.getProject(id);
      setProject(d.project);
    } catch (err) {
      console.error('Failed to resolve blocker', err);
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className="page-shell min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title={project.name} subtitle={project.description} />

      <div className="content-layer p-5 lg:p-6 space-y-5">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={14} /> Projects
          </button>
          {error && (
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--warning)' }}>
              <RefreshCw size={10} /> {error}
            </span>
          )}
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Progress', value: `${project.progress}%`, color: 'var(--accent)' },
            { label: 'Team Size', value: teamMembers.length, color: 'var(--info)' },
            { label: 'Blockers', value: project.blockers, color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' },
            { label: 'Morale Score', value: project.morale, color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="premium-card p-4 theme-transition"
              style={cardStyle}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Progress chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="premium-card p-5 theme-transition" style={cardStyle}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Progress Timeline</div>
                <div className="flex gap-2">
                  <HealthBadge status={project.health} />
                  <RiskBadge level={project.risk} />
                </div>
              </div>
              <div className="mb-4">
                <ProgressBar value={project.progress} />
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={progressHistory}>
                  <defs>
                    <linearGradient id="gProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="progress" stroke="#6366f1" fill="url(#gProgress)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Blockers */}
            {blockerList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="premium-card p-5 theme-transition"
                style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)20' }}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Blockers</div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
                    {blockerList.filter(b => b.status !== 'resolved').length} open
                  </span>
                </div>
                <div className="space-y-2">
                  {blockerList.map(b => (
                    <div key={b.id} className="flex items-start gap-3 px-3 py-2.5 rounded-2xl premium-card theme-transition"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        opacity: b.status === 'resolved' ? 0.6 : 1,
                      }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: b.status === 'resolved' ? '#34d399' : (severityColor[b.severity] || 'var(--danger)') }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{
                          color: 'var(--text-primary)',
                          textDecoration: b.status === 'resolved' ? 'line-through' : 'none',
                        }}>{b.title}</div>
                        {b.description && (
                          <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{b.description}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs capitalize font-medium" style={{ color: b.status === 'resolved' ? '#34d399' : severityColor[b.severity] }}>
                            {b.status === 'resolved' ? '✓ resolved' : b.severity}
                          </span>
                          {b.reporter_name && (
                            <>
                              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.reporter_name}</span>
                            </>
                          )}
                          {b.resolvedAt && (
                            <>
                              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {new Date(b.resolvedAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {b.status !== 'resolved' && (
                        <button
                          onClick={() => resolveBlocker(b.id)}
                          disabled={resolvingId === b.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 transition-all"
                          style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid var(--success)30' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                          {resolvingId === b.id
                            ? <span className="w-3 h-3 border border-current rounded-full animate-spin border-t-transparent" />
                            : <CheckCircle size={11} />}
                          {resolvingId === b.id ? '' : 'Resolve'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Signal Activity Feed */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="premium-card p-5 theme-transition" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} style={{ color: 'var(--text-muted)' }} />
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Signal Activity</div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {project.updates?.length || 0} check-ins
                </span>
              </div>

              {project.updates?.length > 0 ? (
                <div className="space-y-2">
                  {project.updates.slice(0, 6).map((update, i) => {
                    const SIGNAL_META = {
                      blocker:  { color: 'var(--danger)',  bg: 'var(--danger-soft)',  icon: '🔴', label: 'Blocker' },
                      risk:     { color: 'var(--warning)', bg: 'var(--warning-soft)', icon: '🟠', label: 'Risk' },
                      morale:   { color: 'var(--warning)', bg: 'var(--warning-soft)', icon: '🟡', label: 'Morale' },
                      progress: { color: 'var(--success)', bg: 'var(--success-soft)', icon: '🟢', label: 'Progress' },
                    };
                    const primarySignal = update.signals?.[0];
                    const meta = SIGNAL_META[primarySignal];
                    const firstMsg = update.messages?.find(m => m.role === 'user');
                    const timeStr = update.created_at
                      ? new Date(update.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : update.createdAt
                        ? new Date(update.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'recently';

                    return (
                      <motion.div key={update.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl theme-transition"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5"
                          style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '10px' }}>
                          {update.author_avatar || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {update.author_name || 'Team member'}
                            </span>
                            {meta && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                style={{ background: meta.bg, color: meta.color }}>
                                {meta.icon} {meta.label}
                              </span>
                            )}
                            {update.signals?.slice(1).map(s => {
                              const m2 = SIGNAL_META[s];
                              return m2 ? (
                                <span key={s} className="text-xs" style={{ color: m2.color }}>{m2.icon}</span>
                              ) : null;
                            })}
                          </div>
                          {firstMsg && (
                            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                              "{firstMsg.content.substring(0, 100)}{firstMsg.content.length > 100 ? '…' : ''}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={10} />{timeStr}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
                  No check-ins yet for this project.
                </div>
              )}
            </motion.div>

            {/* Velocity & Morale metrics */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="premium-card p-5 theme-transition" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Health Metrics</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Morale gauge */}
                <div className="rounded-xl p-4 text-center theme-transition"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Team Morale</div>
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8"
                        style={{ stroke: 'var(--bg-overlay)' }} />
                      <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8"
                        strokeDasharray={`${(project.morale / 100) * 201} 201`}
                        strokeLinecap="round"
                        style={{
                          stroke: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)',
                          transition: 'stroke-dasharray 0.8s ease',
                        }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold" style={{
                        color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)'
                      }}>{project.morale}</span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {project.morale >= 70 ? '😊 High' : project.morale >= 50 ? '😐 Medium' : '😔 Low'}
                  </div>
                </div>

                {/* Risk gauge */}
                <div className="rounded-xl p-4 text-center theme-transition"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Risk Level</div>
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    {(() => {
                      const riskVal = { low: 20, medium: 50, high: 75, critical: 100 }[project.risk] || 50;
                      const riskColor = { low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)', critical: 'var(--danger)' }[project.risk];
                      return (
                        <>
                          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8"
                              style={{ stroke: 'var(--bg-overlay)' }} />
                            <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8"
                              strokeDasharray={`${(riskVal / 100) * 201} 201`}
                              strokeLinecap="round"
                              style={{ stroke: riskColor, transition: 'stroke-dasharray 0.8s ease' }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Shield size={20} style={{ color: riskColor }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="text-xs font-semibold capitalize" style={{
                    color: { low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)', critical: 'var(--danger)' }[project.risk]
                  }}>{project.risk}</div>
                </div>

                {/* Blocker trend */}
                <div className="premium-card p-4 theme-transition"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Open Blockers</div>
                  <div className="text-2xl font-bold mb-1"
                    style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {project.blockers}
                  </div>
                  <div className="flex items-center gap-1 text-xs"
                    style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {project.blockers > 0
                      ? <><TrendingUp size={11} /> Needs attention</>
                      : <><TrendingDown size={11} /> All clear</>}
                  </div>
                </div>

                {/* Completion forecast */}
                <div className="premium-card p-4 theme-transition"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Completion</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                    {project.progress}%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {project.progress >= 90 ? '🎯 Near done'
                      : project.progress >= 60 ? '📈 On track'
                      : project.progress >= 30 ? '⚡ In progress'
                      : '🚀 Early stage'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Team */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="premium-card p-5 theme-transition" style={cardStyle}>
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} style={{ color: 'var(--text-muted)' }} />
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Team</div>
              </div>
              {manager && (
                <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Manager</div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '10px' }}>
                      {manager.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{manager.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{manager.title}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Members</div>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', fontSize: '10px', color: 'var(--accent)' }}>
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{member.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project info */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="premium-card p-5 theme-transition" style={cardStyle}>
              <div className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Project Info</div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Department</span>
                  <span style={{ color: 'var(--text-primary)' }}>{project.department}</span>
                </div>
                {project.deadline && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Deadline</span>
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <Calendar size={10} />
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs items-start">
                  <span style={{ color: 'var(--text-muted)' }}>Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {(Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags || '[]')).map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="premium-card p-5 theme-transition"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={13} style={{ color: 'var(--accent)' }} />
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insights</div>
                </div>
                <div className="space-y-2">
                  {insights.map(insight => (
                    <div key={insight.id} className="flex gap-2 text-xs">
                      <span>{insight.icon}</span>
                      <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.message}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contributor activity */}
            {project.updates?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="premium-card p-5 theme-transition" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} style={{ color: 'var(--text-muted)' }} />
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Contributors</div>
                </div>
                <div className="space-y-2">
                  {(() => {
                    // Aggregate updates per contributor
                    const contrib = {};
                    project.updates.forEach(u => {
                      const key = u.author_name || 'Unknown';
                      if (!contrib[key]) contrib[key] = { name: key, avatar: u.author_avatar || '?', count: 0, signals: new Set() };
                      contrib[key].count++;
                      u.signals?.forEach(s => contrib[key].signals.add(s));
                    });
                    return Object.values(contrib).sort((a, b) => b.count - a.count).map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '10px' }}>
                          {c.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.count} check-in{c.count !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="flex gap-1">
                          {[...c.signals].slice(0, 3).map(s => {
                            const icons = { blocker: '🔴', risk: '🟠', morale: '🟡', progress: '🟢' };
                            return icons[s] ? <span key={s} className="text-xs">{icons[s]}</span> : null;
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
