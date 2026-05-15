import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Users, MessageSquare,
  BarChart3, LogOut, Zap, ChevronRight, Inbox,
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

export default function Sidebar() {
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
      transition={{ duration: 0.3 }}
      className="w-60 h-screen flex flex-col fixed left-0 top-0 z-40 sidebar-bg theme-transition"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>NorthStar</div>
          <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Operational AI</div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ height: 1, background: 'var(--border)' }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group`}
                style={{
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--accent)' : 'inherit', flexShrink: 0 }} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} style={{ color: 'var(--accent)' }} />}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className="px-3 py-2.5 rounded-xl flex items-center gap-2"
          style={{ background: role.bg, border: `1px solid ${role.color}30` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: role.color }} />
          <div>
            <div className="text-xs font-semibold" style={{ color: role.color }}>{role.label}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentUser.title}</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl cursor-pointer transition-all theme-transition"
          style={{ marginTop: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', fontSize: '11px' }}>
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{currentUser.email}</div>
          </div>
          <button onClick={handleLogout}
            className="transition-colors p-1 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
