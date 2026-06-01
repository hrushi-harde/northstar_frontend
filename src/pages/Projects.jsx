import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Clock, ChevronRight, LayoutGrid, List } from 'lucide-react';
import TopBar from '../components/TopBar';
import HealthBadge from '../components/HealthBadge';
import RiskBadge from '../components/RiskBadge';
import ProgressBar from '../components/ProgressBar';
import { api } from '../api/client';
import { projects as staticProjects } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState(staticProjects);
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProjects().then(d => { if (d.projects?.length) setProjects(d.projects); }).catch(console.error);
  }, []);

  const filtered = projects.filter(p => {
    const matchFilter = filter === 'all' || p.health === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const canCreateProject = user?.role === 'manager' || user?.role === 'executive';
  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };
  const visibleCount = filtered.length;

  return (
    <div className="page-shell min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Projects" subtitle={`${projects.length} projects across all teams`} />

      <div className="content-layer p-5 lg:p-6 space-y-5">
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5 lg:p-6" style={{ background: 'var(--bg-glass)', boxShadow: 'var(--shadow-xl)' }}>
          <div className="flex flex-col xl:flex-row xl:items-end gap-4">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.22em] mb-2" style={{ color: 'var(--text-muted)' }}>Portfolio</div>
              <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Projects, polished for fast executive scanning.</h2>
              <p className="mt-2 text-sm lg:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>A premium portfolio view with enterprise-grade table controls, clearer project hierarchies, and richer status surfaces.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 xl:min-w-[24rem]">
              {[
                { label: 'Visible', value: visibleCount },
                { label: 'Healthy', value: projects.filter(p => p.health === 'healthy').length },
                { label: 'Blocked', value: projects.filter(p => p.health === 'blocked').length },
              ].map(stat => (
                <div key={stat.label} className="premium-card p-4" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="text-[11px] uppercase tracking-[0.18em] mb-1.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 min-w-[18rem] premium-card" style={{ background: 'var(--bg-glass)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-transparent outline-none text-sm" />
          </div>

          <div className="flex gap-1 p-1 rounded-2xl premium-card" style={{ background: 'var(--bg-glass)' }}>
            {['all', 'healthy', 'at-risk', 'blocked'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize" style={{ background: filter === f ? 'var(--accent-soft)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text-muted)', border: filter === f ? '1px solid var(--accent-border)' : '1px solid transparent' }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-2xl premium-card" style={{ background: 'var(--bg-glass)' }}>
            {[{ v: 'grid', Icon: LayoutGrid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5" style={{ background: view === v ? 'var(--accent-soft)' : 'transparent', color: view === v ? 'var(--accent)' : 'var(--text-muted)', border: view === v ? '1px solid var(--accent-border)' : '1px solid transparent' }}>
                <Icon size={13} />
                <span className="capitalize">{v}</span>
              </button>
            ))}
          </div>

          {canCreateProject && (
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => navigate('/team')} className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white premium-button-primary">
              <Plus size={14} /> New Project
            </motion.button>
          )}
        </div>

        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((project, i) => {
                const manager = project.manager || null;
                const teamSize = project.team?.length || 0;
                return (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -4, transition: { duration: 0.15 } }} onClick={() => navigate(`/projects/${project.id}`)} className="premium-card premium-card-interactive p-5 cursor-pointer" style={cardStyle}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{project.name}</div>
                        <div className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</div>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-faint)', flexShrink: 0, marginTop: 2 }} />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <HealthBadge status={project.health} />
                      <RiskBadge level={project.risk} />
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <div className="text-center">
                        <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{teamSize}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-semibold" style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>{project.blockers}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Blockers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-semibold" style={{ color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{project.morale}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Morale</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '9px' }}>{manager?.avatar}</div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{manager?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} /> {project.lastUpdate}
                      </div>
                    </div>

                    {(Array.isArray(project.tags) ? project.tags : []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(Array.isArray(project.tags) ? project.tags : []).map(tag => (<span key={tag} className="chip" style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{tag}</span>))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {view === 'list' && (
          <div className="table-shell rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[980px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                    <th className="text-left px-5 py-4">Project</th>
                    <th className="text-left px-5 py-4">Health</th>
                    <th className="text-left px-5 py-4">Progress</th>
                    <th className="text-left px-5 py-4">Team</th>
                    <th className="text-left px-5 py-4">Blockers</th>
                    <th className="text-left px-5 py-4">Morale</th>
                    <th className="text-left px-5 py-4">Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project, i) => {
                    const manager = project.manager || null;
                    const teamSize = project.team?.length || 0;
                    return (
                      <motion.tr key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} onClick={() => navigate(`/projects/${project.id}`)} className="data-row cursor-pointer" style={{ borderTop: '1px solid var(--border)' }}>
                        <td className="px-5 py-4 align-middle">
                          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</div>
                          <div className="text-xs mt-1 max-w-[20rem] line-clamp-2" style={{ color: 'var(--text-muted)' }}>{manager?.name || project.department}</div>
                        </td>
                        <td className="px-5 py-4 align-middle"><HealthBadge status={project.health} /></td>
                        <td className="px-5 py-4 align-middle">
                          <div className="flex items-center gap-3 min-w-[15rem]">
                            <div className="flex-1"><ProgressBar value={project.progress} /></div>
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{project.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 align-middle text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span className="inline-flex items-center gap-1.5"><Users size={12} />{teamSize}</span>
                        </td>
                        <td className="px-5 py-4 align-middle text-sm font-semibold" style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>{project.blockers}</td>
                        <td className="px-5 py-4 align-middle text-sm font-semibold" style={{ color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{project.morale}</td>
                        <td className="px-5 py-4 align-middle text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span className="inline-flex items-center gap-1"><Clock size={10} />{project.lastUpdate || project.updated_at?.split('T')[0] || '—'}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 premium-card" style={{ background: 'var(--bg-glass)' }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No projects match your filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
