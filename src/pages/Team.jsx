import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, X, Check } from 'lucide-react';
import TopBar from '../components/TopBar';
import HealthBadge from '../components/HealthBadge';
import ProgressBar from '../components/ProgressBar';
import { api } from '../api/client';
import { users as staticUsers, projects as staticProjects } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function CreateProjectModal({ onClose, users, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', manager_id: '', department: 'Engineering', members: [] });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const managers = users.filter(u => u.role === 'manager' || u.role === 'executive');
  const employees = users.filter(u => u.role === 'employee');

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      members: f.members.includes(id) ? f.members.filter(m => m !== id) : [...f.members, id],
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.manager_id) { setError('Project name and manager are required'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await api.createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        manager_id: form.manager_id,
        department: form.department,
        members: form.members,
      });
      onCreated?.(data.project);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl p-6 theme-transition"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-xl)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Create New Project</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Step {step} of 2</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <X size={18} />
          </button>
        </div>

        {/* Progress steps */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: s <= step ? 'linear-gradient(90deg, var(--accent), var(--purple))' : 'var(--bg-overlay)' }} />
          ))}
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-xl text-xs"
            style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)30', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Project Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Project Phoenix"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none input-base" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief project description..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none input-base" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Department</label>
              <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none input-base"
                style={{ background: 'var(--bg-elevated)' }}>
                {['Engineering', 'Product', 'Platform', 'QA', 'Design', 'Data'].map(d => (
                  <option key={d} value={d} style={{ background: 'var(--bg-surface)' }}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>Assign Manager *</label>
              <div className="grid grid-cols-2 gap-2">
                {managers.map(m => (
                  <button key={m.id} onClick={() => setForm(f => ({ ...f, manager_id: m.id }))}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: form.manager_id === m.id ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      border: `1px solid ${form.manager_id === m.id ? 'var(--accent-border)' : 'var(--border)'}`,
                    }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '10px' }}>
                      {m.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.department}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="text-xs font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>Select Team Members</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {employees.map(emp => {
                const selected = form.members.includes(emp.id);
                return (
                  <button key={emp.id} onClick={() => toggleMember(emp.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                    style={{
                      background: selected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      border: `1px solid ${selected ? 'var(--accent-border)' : 'var(--border)'}`,
                    }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                      style={{ background: 'var(--bg-overlay)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {emp.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{emp.title} · {emp.department}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selected ? '' : 'opacity-0'}`}
                      style={{ background: selected ? 'var(--accent)' : 'transparent' }}>
                      {selected && <Check size={11} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 rounded-xl text-sm transition-all btn-ghost">
              Back
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            onClick={() => step < 2 ? setStep(2) : handleCreate()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 btn-primary">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : step < 2 ? 'Next: Add Members' : 'Create Project'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Team() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(staticUsers);
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    Promise.all([api.getUsers(), api.getProjects()])
      .then(([ud, pd]) => {
        if (ud.users?.length) setUsers(ud.users);
        if (pd.projects?.length) setProjects(pd.projects);
      }).catch(console.error);
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase())
  );

  const getUserProjects = (userId) =>
    projects.filter(p =>
      p.team?.some(m => (typeof m === 'string' ? m : m.id) === userId) ||
      (p.manager_id || p.manager) === userId
    );

  const roleColors = {
    executive: { bg: 'var(--purple-soft)', color: 'var(--purple)' },
    manager:   { bg: 'var(--accent-soft)', color: 'var(--accent)' },
    employee:  { bg: 'var(--info-soft)',   color: 'var(--info)' },
  };
  const canCreateProject = user?.role === 'manager' || user?.role === 'executive';
  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };

  return (
    <div className="page-shell min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <TopBar title="Team Management" subtitle="Manage members, projects, and assignments" />

      <div className="content-layer p-5 lg:p-6 space-y-5">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: 'var(--text-primary)' }} />
          </div>
          {canCreateProject && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white ml-auto btn-primary">
              <Plus size={14} /> New Project
            </motion.button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: users.length, color: 'var(--accent)' },
            { label: 'Managers', value: users.filter(u => u.role === 'manager').length, color: 'var(--purple)' },
            { label: 'Engineers', value: users.filter(u => u.department === 'Engineering').length, color: 'var(--info)' },
            { label: 'Active Projects', value: projects.length, color: 'var(--success)' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="premium-card p-4 theme-transition" style={cardStyle}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Team list */}
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Team Members
            </div>
            <div className="space-y-2">
              {filtered.map((member, i) => {
                const userProjects = getUserProjects(member.id);
                const isSelected = selectedUser?.id === member.id;
                const rc = roleColors[member.role] || roleColors.employee;
                return (
                  <motion.div key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedUser(isSelected ? null : member)}
                    className="premium-card p-4 cursor-pointer transition-all theme-transition"
                    style={{
                      background: isSelected ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      border: `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border)'}`,
                    }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                        style={{ background: rc.bg, color: rc.color, fontSize: '11px', border: `1px solid ${rc.color}30` }}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{member.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                            style={{ background: rc.bg, color: rc.color }}>
                            {member.role}
                          </span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{member.title} · {member.department}</div>
                      </div>
                      <div className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Users size={11} />{userProjects.length} projects
                      </div>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 overflow-hidden"
                          style={{ borderTop: '1px solid var(--border)' }}>
                          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Assigned Projects</div>
                          {userProjects.length > 0 ? (
                            <div className="space-y-2">
                              {userProjects.map(p => (
                                <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-2xl premium-card"
                                  style={{ background: 'var(--bg-elevated)' }}>
                                  <div className="flex-1">
                                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                                    <div className="mt-1"><ProgressBar value={p.progress} /></div>
                                  </div>
                                  <HealthBadge status={p.health} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>No projects assigned</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Projects overview */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Active Projects
            </div>
            <div className="space-y-3">
              {projects.map((project, i) => {
                const manager = users.find(u => u.id === (project.manager_id || project.manager));
                const teamSize = project.team?.length || 0;
                return (
                  <motion.div key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="premium-card p-4 theme-transition"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</div>
                      <HealthBadge status={project.health} />
                    </div>
                    <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      {manager?.name || 'Unknown'} · {teamSize} members
                    </div>
                    <ProgressBar value={project.progress} />
                    <div className="flex justify-between text-xs mt-2">
                      <span style={{ color: 'var(--text-muted)' }}>{project.progress}% complete</span>
                      <span style={{ color: project.blockers > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {project.blockers} blockers
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal
            onClose={() => setShowCreate(false)}
            users={users}
            onCreated={(newProject) => setProjects(prev => [newProject, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
