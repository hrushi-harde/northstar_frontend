import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Zap, ChevronDown, AlertTriangle, TrendingUp,
  Sparkles, Database, ShieldAlert, Heart, BarChart2,
  Clock, Filter,
} from 'lucide-react';
import TopBar from '../components/TopBar';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { projects as staticProjects, aiSuggestedResponses } from '../data/mockData';

const SIGNAL_TYPES = {
  blocker:  { label: 'Blocker Detected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  icon: '🔴' },
  risk:     { label: 'Delivery Risk',    color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: '🟠' },
  morale:   { label: 'Morale Signal',    color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '🟡' },
  progress: { label: 'Progress Update',  color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '🟢' },
  resolved: { label: 'Blocker Cleared',  color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '✅' },
};

const HEALTH_COLOR = { healthy: '#34d399', 'at-risk': '#fbbf24', blocked: '#ef4444' };
const RISK_COLOR   = { low: '#34d399', medium: '#fbbf24', high: '#f97316', critical: '#ef4444' };

function AnalysisCard({ metrics, projectMutations, insight, usedLLM }) {
  const hasMetrics   = metrics   && Object.keys(metrics).length > 0;
  const hasMutations = projectMutations && Object.keys(projectMutations).length > 0;
  const hasInsight   = !!insight;
  if (!hasMetrics && !hasMutations && !hasInsight) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-2 rounded-xl overflow-hidden text-xs theme-transition"
      style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}
    >
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--accent-border)' }}>
        <Sparkles size={11} style={{ color: 'var(--accent)' }} />
        <span className="font-medium" style={{ color: 'var(--accent)' }}>
          {usedLLM ? 'Gemini AI Analysis' : 'AI Analysis'}
        </span>
        {usedLLM && (
          <span className="ml-auto flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            Gemini
          </span>
        )}
      </div>

      <div className="px-3 py-2.5 space-y-2.5">
        {hasMetrics && (
          <div>
            <div className="uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <Database size={9} /> Extracted
            </div>
            <div className="flex flex-wrap gap-1.5">
              {metrics.progressPercent !== undefined && <Chip icon="📊" label={`Progress: ${metrics.progressPercent}%`} color="var(--accent)" />}
              {metrics.prsReviewed && <Chip icon="✅" label={`${metrics.prsReviewed} PR(s) reviewed`} color="var(--success)" />}
              {metrics.daysBlocked && <Chip icon="⏱️" label={`Blocked ${metrics.daysBlocked}d`} color="var(--danger)" />}
              {metrics.hoursBlocked && <Chip icon="⏱️" label={`Blocked ${metrics.hoursBlocked}h`} color="var(--danger)" />}
              {metrics.peopleAffected && <Chip icon="👥" label={`${metrics.peopleAffected} affected`} color="var(--warning)" />}
              {metrics.ticketCount && <Chip icon="🎫" label={`${metrics.ticketCount} ticket(s)`} color="var(--purple)" />}
              {metrics.moraleSignal && (
                <Chip
                  icon={metrics.moraleSignal === 'high' ? '😊' : metrics.moraleSignal === 'low' ? '😔' : '😐'}
                  label={`Morale: ${metrics.moraleSignal}`}
                  color={metrics.moraleSignal === 'high' ? 'var(--success)' : metrics.moraleSignal === 'low' ? 'var(--danger)' : 'var(--warning)'}
                />
              )}
              {metrics.riskLevel && <Chip icon="⚠️" label={`Risk: ${metrics.riskLevel}`} color={RISK_COLOR[metrics.riskLevel]} />}
              {metrics.blockerTitle && (
                <div className="w-full px-2 py-1 rounded-lg leading-relaxed" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)20', color: 'var(--text-secondary)' }}>
                  🔴 <span style={{ color: 'var(--danger)' }}>Blocker:</span> {metrics.blockerTitle}
                </div>
              )}
            </div>
          </div>
        )}

        {hasMutations && (
          <div>
            <div className="uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <ShieldAlert size={9} /> DB Updated
            </div>
            <div className="flex flex-wrap gap-1.5">
              {projectMutations.progress !== undefined && <Chip icon="📈" label={`Progress → ${projectMutations.progress}%`} color="var(--accent)" />}
              {projectMutations.morale !== undefined && <Chip icon="💙" label={`Morale → ${projectMutations.morale}`} color="#ec4899" />}
              {projectMutations.risk && <Chip icon="⚠️" label={`Risk → ${projectMutations.risk}`} color={RISK_COLOR[projectMutations.risk]} />}
              {projectMutations.health && <Chip icon="🏥" label={`Health → ${projectMutations.health}`} color={HEALTH_COLOR[projectMutations.health]} />}
            </div>
          </div>
        )}

        {hasInsight && (
          <div className="flex items-start gap-2 px-2 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <span className="text-sm flex-shrink-0">{insight.icon}</span>
            <span className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.message}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Chip({ icon, label, color }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      {icon} {label}
    </span>
  );
}

// ── Executive view ────────────────────────────────────────────────────────
function ExecutiveUpdatesView() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getUpdates({ limit: 50 })
      .then(d => setUpdates(d.updates || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const SIGNAL_COLORS = {
    blocker:  { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  icon: '🔴', label: 'Blocker' },
    risk:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: '🟠', label: 'Risk' },
    morale:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '🟡', label: 'Morale' },
    progress: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '🟢', label: 'Progress' },
  };

  const filtered = filter === 'all' ? updates : updates.filter(u => u.signals?.includes(filter));

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Team Updates" subtitle="Organisation-wide operational update feed" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Filter:</span>
          {['all', 'blocker', 'risk', 'morale', 'progress'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all capitalize"
              style={filter === f
                ? { background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }
                : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {f === 'all' ? 'All Updates' : `${SIGNAL_COLORS[f]?.icon} ${SIGNAL_COLORS[f]?.label}`}
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{filtered.length} updates</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--accent-soft)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>No updates found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((update, i) => (
              <motion.div key={update.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-xl p-4 theme-transition"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '10px' }}>
                    {update.author_avatar || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{update.author_name || 'Unknown'}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{update.project_name}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={10} />
                    {new Date(update.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {update.messages?.[0] && (
                  <div className="text-sm leading-relaxed mb-3 px-1" style={{ color: 'var(--text-secondary)' }}>
                    "{update.messages[0].content}"
                  </div>
                )}
                {update.signals?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {update.signals.map(s => {
                      const sig = SIGNAL_COLORS[s];
                      return sig ? (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: sig.bg, color: sig.color }}>
                          {sig.icon} {sig.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Manager view ──────────────────────────────────────────────────────────
function ManagerUpdatesView() {
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([api.getUpdates({ limit: 100 }), api.getProjects()])
      .then(([ud, pd]) => {
        setUpdates(ud.updates || []);
        setProjects(pd.projects || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const SIGNAL_COLORS = {
    blocker:  { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  icon: '🔴' },
    risk:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: '🟠' },
    morale:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: '🟡' },
    progress: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '🟢' },
  };

  const filtered = projectFilter === 'all' ? updates
    : updates.filter(u => u.project_name === projectFilter || u.projectId === projectFilter);

  const grouped = filtered.reduce((acc, u) => {
    const key = u.project_name || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(u);
    return acc;
  }, {});

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Team Updates" subtitle="Review your team's operational check-ins" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Project:</span>
          <button onClick={() => setProjectFilter('all')}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={projectFilter === 'all'
              ? { background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }
              : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            All Projects
          </button>
          {projects.map(p => (
            <button key={p.id} onClick={() => setProjectFilter(p.name)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={projectFilter === p.name
                ? { background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }
                : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {p.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--accent-soft)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>No updates from your team yet.</div>
        ) : (
          Object.entries(grouped).map(([projectName, projectUpdates]) => (
            <div key={projectName}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{projectName}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>({projectUpdates.length})</div>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              <div className="space-y-2">
                {projectUpdates.map((update, i) => (
                  <motion.div key={update.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="rounded-xl overflow-hidden cursor-pointer theme-transition"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    onClick={() => setExpanded(expanded === update.id ? null : update.id)}>
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', fontSize: '10px', color: 'var(--accent)' }}>
                        {update.author_avatar || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{update.author_name}</span>
                          {update.signals?.map(s => SIGNAL_COLORS[s] && (
                            <span key={s} className="text-xs">{SIGNAL_COLORS[s].icon}</span>
                          ))}
                        </div>
                        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {update.messages?.[0]?.content?.substring(0, 80)}…
                        </div>
                      </div>
                      <div className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {new Date(update.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expanded === update.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                          style={{ borderTop: '1px solid var(--border)' }}>
                          <div className="p-4 space-y-2">
                            {update.messages?.map((msg, j) => (
                              <div key={j} className="px-3 py-2 rounded-xl text-xs leading-relaxed"
                                style={{
                                  background: msg.role === 'user' ? 'var(--bg-elevated)' : 'var(--accent-soft)',
                                  border: `1px solid ${msg.role === 'user' ? 'var(--border)' : 'var(--accent-border)'}`,
                                  color: msg.role === 'user' ? 'var(--text-secondary)' : 'var(--accent)',
                                }}>
                                {msg.role === 'ai' && <span className="font-semibold" style={{ color: 'var(--accent)' }}>AI · </span>}
                                {msg.content}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
export default function Updates() {
  const { user } = useAuth();
  if (user?.role === 'executive') return <ExecutiveUpdatesView />;
  if (user?.role === 'manager')   return <ManagerUpdatesView />;
  return <EmployeeUpdatesView />;
}

// ── Employee view ─────────────────────────────────────────────────────────
function EmployeeUpdatesView() {
  const { user } = useAuth();
  const currentUser = user || { name: 'Team Member', avatar: 'TM' };

  const [projects, setProjects]               = useState(staticProjects);
  const [selectedProject, setSelectedProject] = useState(staticProjects[0] || null);
  const [projectOpen, setProjectOpen]         = useState(false);
  const [messages, setMessages]               = useState([{
    id: 1, role: 'ai',
    content: `Hey ${user?.name?.split(' ')[0] || 'there'} 👋 Ready for your daily operational update. What are you working on today, and how's it going?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput]                     = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const [activeUpdateId, setActiveUpdateId]   = useState(null);
  const [detectedSignals, setDetectedSignals] = useState([]);
  const [liveProject, setLiveProject]         = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.getProjects().then(d => {
      if (d.projects?.length) {
        setProjects(d.projects);
        setSelectedProject(prev => prev || d.projects[0]);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLiveProject(selectedProject);
    setActiveUpdateId(null);
    setDetectedSignals([]);
  }, [selectedProject?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || !selectedProject) return;
    setInput('');
    setIsTyping(true);

    const userMsg = {
      id: Date.now(), role: 'user', content: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);

    const attemptSend = async (retryCount = 0) => {
      try {
        let data;
        if (!activeUpdateId) {
          data = await api.createUpdate({ project_id: selectedProject.id, content: msg });
          setActiveUpdateId(data.update.id);
        } else {
          data = await api.sendMessage(activeUpdateId, msg);
        }
        const newSignals = data.signals || [];
        if (data.blockerResolved && data.resolvedCount > 0) {
          newSignals.push('resolved');
          // Remove 'blocker' from detected signals since it's now cleared
          setDetectedSignals(prev => [...new Set([...prev.filter(s => s !== 'blocker'), 'resolved'])]);
        } else {
          setDetectedSignals(prev => [...new Set([...prev, ...newSignals])]);
        }
        if (data.updatedProject) setLiveProject(data.updatedProject);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1, role: 'ai',
          content: data.aiResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: data.metrics || {},
          projectMutations: data.projectMutations || {},
          insight: data.insight || null,
          usedLLM: data.usedLLM || false,
          signals: newSignals,
        }]);
      } catch (err) {
        if (retryCount === 0) {
          await new Promise(r => setTimeout(r, 3000));
          return attemptSend(1);
        }
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1, role: 'ai',
          content: `Sorry, I couldn't process that right now (${err?.message || 'server error'}). Please try again.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    };
    await attemptSend();
  };

  const displayProject = liveProject || selectedProject;

  return (
    <div className="min-h-screen flex flex-col theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Conversational Update" subtitle="AI-powered operational check-in" />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Project selector */}
          <div className="px-6 py-3 flex items-center gap-3 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Updating for:</span>
            <div className="relative">
              <button
                onClick={() => setProjectOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                {selectedProject?.name || 'Select project'}
                <ChevronDown size={12} className={`transition-transform ${projectOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {projectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute top-10 left-0 w-56 rounded-xl overflow-hidden z-20 theme-transition"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-xl)' }}>
                    {projects.map(p => (
                      <button key={p.id}
                        onClick={() => { setSelectedProject(p); setProjectOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <span>{p.name}</span>
                        <span className="text-xs" style={{ color: HEALTH_COLOR[p.health] }}>●</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
              <Sparkles size={10} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--accent)' }}>Gemini AI</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1"
                    style={{
                      background: msg.role === 'ai'
                        ? 'linear-gradient(135deg, var(--accent), var(--purple))'
                        : 'var(--bg-elevated)',
                      border: msg.role === 'user' ? '1px solid var(--border)' : 'none',
                      fontSize: '10px',
                      color: msg.role === 'user' ? 'var(--text-secondary)' : 'white',
                    }}>
                    {msg.role === 'ai' ? <Zap size={12} className="text-white" /> : currentUser.avatar}
                  </div>

                  <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end max-w-lg' : 'items-start max-w-xl'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--accent), var(--purple))'
                          : 'var(--bg-elevated)',
                        border: msg.role === 'ai' ? '1px solid var(--border)' : 'none',
                        color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                      }}>
                      {msg.content}
                    </div>

                    {msg.role === 'ai' && msg.signals?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.signals.map(s => {
                          const sig = SIGNAL_TYPES[s];
                          return sig ? (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: sig.bg, color: sig.color }}>
                              {sig.icon} {sig.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {msg.role === 'ai' && (msg.metrics || msg.projectMutations || msg.insight) && (
                      <AnalysisCard
                        metrics={msg.metrics}
                        projectMutations={msg.projectMutations}
                        insight={msg.insight}
                        usedLLM={msg.usedLLM}
                      />
                    )}

                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{msg.time}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex gap-3 items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
                    <Sparkles size={12} className="text-white animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }} />
                    ))}
                    <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>Gemini is analysing…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggested responses */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
            style={{ borderTop: '1px solid var(--border)' }}>
            {aiSuggestedResponses.map((s, i) => (
              <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                {s}
              </motion.button>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex gap-3 items-end">
              <div className="flex-1 rounded-xl px-4 py-3 flex items-end gap-3"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Share your update… e.g. 'Reviewed 3 PRs, deployment is blocked due to QA issues'"
                  rows={2}
                  className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: input.trim() && !isTyping ? 'linear-gradient(135deg, var(--accent), var(--purple))' : 'var(--bg-elevated)' }}>
                <Send size={15} style={{ color: input.trim() && !isTyping ? '#fff' : 'var(--text-muted)' }} />
              </motion.button>
            </div>
            <div className="text-xs mt-2 text-center" style={{ color: 'var(--text-faint)' }}>
              Powered by Gemini AI · signals extracted automatically · Enter to send
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto theme-transition"
          style={{ borderLeft: '1px solid var(--border)' }}>
          {/* Detected signals */}
          <div className="p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Detected Signals
            </div>
            {detectedSignals.length === 0 ? (
              <div className="text-xs text-center py-6" style={{ color: 'var(--text-faint)' }}>
                Signals appear here as Gemini analyses your updates
              </div>
            ) : (
              <div className="space-y-2">
                {detectedSignals.map(s => {
                  const sig = SIGNAL_TYPES[s];
                  return sig ? (
                    <motion.div key={s}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium"
                      style={{ background: sig.bg, border: `1px solid ${sig.color}30`, color: sig.color }}>
                      <span>{sig.icon}</span>{sig.label}
                    </motion.div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Session stats */}
          <div className="px-4 pb-4 pt-2 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Session</div>
            {[
              { label: 'Messages',  value: messages.length,        icon: Zap },
              { label: 'Signals',   value: detectedSignals.length, icon: AlertTriangle },
              { label: 'Project',   value: selectedProject?.name?.split(' ')[0] || '—', icon: TrendingUp },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <stat.icon size={11} />{stat.label}
                </div>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Live project state */}
          {displayProject && (
            <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Live Project State
              </div>
              <div className="rounded-xl p-3 space-y-2.5 theme-transition"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{displayProject.name}</div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{displayProject.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                    <motion.div
                      animate={{ width: `${displayProject.progress}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, var(--accent), var(--purple))' }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs font-bold" style={{ color: HEALTH_COLOR[displayProject.health] }}>
                      {displayProject.health}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>health</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: RISK_COLOR[displayProject.risk] }}>
                      {displayProject.risk}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>risk</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold"
                      style={{ color: displayProject.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {displayProject.blockers}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>blockers</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Heart size={9} /> Morale
                    </span>
                    <span className="font-semibold" style={{
                      color: displayProject.morale >= 70 ? 'var(--success)' : displayProject.morale >= 50 ? 'var(--warning)' : 'var(--danger)'
                    }}>{displayProject.morale}</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                    <motion.div
                      animate={{ width: `${displayProject.morale}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        background: displayProject.morale >= 70 ? 'var(--success)'
                          : displayProject.morale >= 50 ? 'var(--warning)' : 'var(--danger)'
                      }} />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-center flex items-center justify-center gap-1" style={{ color: 'var(--text-faint)' }}>
                <BarChart2 size={9} /> Updates reflect in dashboard instantly
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
