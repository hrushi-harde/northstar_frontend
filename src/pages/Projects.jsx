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

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Projects" subtitle={`${projects.length} projects across all teams`} />

      <div className="p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: 'var(--text-primary)' }} />
          </div>

          {/* Health filter */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {['all', 'healthy', 'at-risk', 'blocked'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: filter === f ? 'var(--accent-soft)' : 'transparent',
                  color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                  border: filter === f ? '1px solid var(--accent-border)' : '1px solid transparent',
                }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 p-1 rounded-xl ml-auto" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {[{ v: 'grid', Icon: LayoutGrid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button key={v} onClick={() => setView(v)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: view === v ? 'var(--accent-soft)' : 'transparent',
                  color: view === v ? 'var(--accent)' : 'var(--text-muted)',
                  border: view === v ? '1px solid var(--accent-border)' : '1px solid transparent',
                }}>
                <Icon size={13} />
                <span className="capitalize">{v}</span>
              </button>
            ))}
          </div>

          {canCreateProject && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/team')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-primary">
              <Plus size={14} /> New Project
            </motion.button>
          )}
        </div>

        {/* Grid view */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((project, i) => {
                const manager = project.manager || null;
                const teamSize = project.team?.length || 0;
                return (
                  <motion.div key={project.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="rounded-xl p-5 cursor-pointer transition-all theme-transition"
                    style={cardStyle}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{project.name}</div>
                        <div className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</div>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--text-faint)', flexShrink: 0, marginTop: 2 }} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <HealthBadge status={project.health} />
                      <RiskBadge level={project.risk} />
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{project.progress}%</span>
                      </div>
                      <ProgressBar value={project.progress} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 py-3 rounded-xl"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <div className="text-center">
                        <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{teamSize}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Members</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-base font-bold`}
                          style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {project.blockers}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Blockers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold"
                          style={{ color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                          {project.morale}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Morale</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '9px' }}>
                          {manager?.avatar}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{manager?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} />
                        {project.lastUpdate}
                      </div>
                    </div>

                    {(Array.isArray(project.tags) ? project.tags : []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(Array.isArray(project.tags) ? project.tags : []).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="rounded-xl overflow-hidden theme-transition" style={{ border: '1px solid var(--border)' }}>
            <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
              style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <div className="col-span-3">Project</div>
              <div className="col-span-2">Health</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-1">Team</div>
              <div className="col-span-1">Blockers</div>
              <div className="col-span-1">Morale</div>
              <div className="col-span-2">Last Update</div>
            </div>
            {filtered.map((project, i) => {
              const manager = project.manager || null;
              const teamSize = project.team?.length || 0;
              return (
                <motion.div key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="grid grid-cols-12 gap-4 px-5 py-4 cursor-pointer transition-all items-center theme-transition"
                  style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}>
                  <div className="col-span-3">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{manager?.name || project.department}</div>
                  </div>
                  <div className="col-span-2"><HealthBadge status={project.health} /></div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={project.progress} />
                      <span className="text-xs w-8" style={{ color: 'var(--text-secondary)' }}>{project.progress}%</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Users size={12} />{teamSize}
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-bold"
                      style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {project.blockers}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-bold"
                      style={{ color: project.morale >= 70 ? 'var(--success)' : project.morale >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {project.morale}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={10} />{project.lastUpdate || project.updated_at?.split('T')[0] || '—'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No projects match your filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
