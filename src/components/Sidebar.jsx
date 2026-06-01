import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Users, MessageSquare,
  BarChart3, LogOut, Zap, ChevronRight, Inbox, PanelLeftClose, PanelRightClose,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getNavItems(role) {
  const base = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects',  icon: FolderKanban,    label: 'Projects' },
  ];
  if (role === 'executive') return [
    ...base,
    { to: '/updates',   icon: Inbox,    label: 'Team Updates' },
    { to: '/analytics', icon: BarChart3, label: 'AI Analytics' },
    { to: '/team',      icon: Users,     label: 'Team' },
  ];
  if (role === 'manager') return [
    ...base,
    { to: '/updates',   icon: Inbox,    label: 'Team Updates' },
    { to: '/analytics', icon: BarChart3, label: 'AI Analytics' },
    { to: '/team',      icon: Users,     label: 'Team' },
  ];
  return [
    ...base,
    { to: '/updates', icon: MessageSquare, label: 'My Update' },
    { to: '/team',    icon: Users,         label: 'Team' },
  ];
}

const roleColors = {
  executive: { bg: 'var(--purple-soft)', color: 'var(--purple)', label: 'Executive' },
  manager:   { bg: 'var(--accent-soft)', color: 'var(--accent)', label: 'Manager' },
  employee:  { bg: 'var(--info-soft)',   color: 'var(--info)',   label: 'Employee' },
};

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUser = user || { name: 'User', avatar: 'U', email: '', title: 'Member', role: 'employee' };
  const navItems = getNavItems(user?.role);
  const role = roleColors[user?.role] || roleColors.employee;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed left-0 top-0 z-40 h-screen flex flex-col sidebar-bg theme-transition"
      style={{ width: collapsed ? 112 : 320 }}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center px-4' : 'justify-between px-5'} pt-5 pb-4`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 glow-accent"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
              <Zap size={20} className="text-white" />
            </div>
            <AnimatePresence initial={false}>
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="min-w-0">
                <div className="font-semibold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>NorthStar</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--text-muted)' }}>CEO Portal</div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-xl flex items-center justify-center theme-transition"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelRightClose size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <div className="mx-4 mb-3" style={{ height: 1, background: 'var(--border)' }} />

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              (() => {
                const iconSize = collapsed ? 22 : 18;
                return (
              <div
                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer group premium-card-interactive`}
                style={{
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 0 1px var(--accent-border), 0 0 22px var(--accent-soft)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={iconSize} style={{ color: isActive ? 'var(--accent)' : 'inherit', flexShrink: 0 }} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="flex-1">{label}</motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && isActive && <ChevronRight size={13} style={{ color: 'var(--accent)' }} />}
              </div>
                );
              })()
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3">
        <div className={`px-3 py-3 rounded-2xl flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}
          style={{ background: role.bg, border: `1px solid ${role.color}30` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: role.color }} />
          {!collapsed && (
            <div>
              <div className="text-xs font-semibold" style={{ color: role.color }}>{role.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser.title}</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-2'} py-3 rounded-2xl cursor-pointer transition-all theme-transition`}
          style={{ marginTop: 10 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '11px' }}>
            {currentUser.avatar}
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{currentUser.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={handleLogout}
            className="transition-colors p-2 rounded-xl"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
