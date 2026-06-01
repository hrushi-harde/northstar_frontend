import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Command, X, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ title, subtitle }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    api.getInsights({ limit: 4 })
      .then(d => { if (d.insights?.length) setInsights(d.insights); })
      .catch(() => {});
  }, []);

  const criticalCount = insights.filter(i => i.severity === 'critical' || i.severity === 'high').length;

  return (
    <header className="sticky top-0 z-30 topbar-bg theme-transition">
      <div className="px-5 lg:px-6 py-4 flex items-center gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'var(--text-muted)' }}>NorthStar</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'var(--text-muted)' }}>CEO Portal</span>
          </div>
          <h1 className="text-lg lg:text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          {subtitle && <p className="text-xs lg:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <div className="relative hidden md:block">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setNotifOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm theme-transition"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
              }}
            >
              <Search size={14} />
              <span className="text-xs">Search everything</span>
              <span className="hidden lg:flex items-center gap-1 ml-1 px-2 py-1 rounded-lg text-[11px]" style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
                <Command size={10} /><span>K</span>
              </span>
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-[22rem] rounded-3xl p-3 z-50 glass"
                  style={{ boxShadow: 'var(--shadow-xl)' }}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl mb-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects, people, insights..." className="bg-transparent text-sm outline-none flex-1" style={{ color: 'var(--text-primary)' }} />
                    <button onClick={() => setSearchOpen(false)}>
                      <X size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] px-2 py-1.5" style={{ color: 'var(--text-muted)' }}>Quick links</div>
                  {['Project Orion', 'Infra Migration', 'James Liu', 'AI Insights'].map(item => (
                    <div key={item} className="px-3 py-2.5 rounded-2xl text-sm cursor-pointer theme-transition" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setSearchOpen(false); }}
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Bell size={15} />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] flex items-center justify-center text-white font-bold" style={{ background: 'var(--danger)' }}>{criticalCount}</span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-[22rem] rounded-3xl overflow-hidden z-50 glass"
                  style={{ boxShadow: 'var(--shadow-xl)' }}
                >
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Alerts</span>
                    </div>
                    <button onClick={() => setNotifOpen(false)}>
                      <X size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {insights.length > 0 ? insights.map(insight => (
                      <div key={insight.id} className="px-4 py-3 cursor-pointer theme-transition" style={{ borderBottom: '1px solid var(--border)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div className="flex items-start gap-3">
                          <span className="text-base mt-0.5">{insight.icon}</span>
                          <div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{insight.project_name || insight.project || 'Organization'}</div>
                            <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.message}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{insight.time || 'recently'}</div>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="px-4 py-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>No alerts at this time</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggle}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={15} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={15} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="hidden lg:flex items-center gap-3 pl-2 pr-1 py-1.5 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
              {user?.avatar || user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 pr-2">
              <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</div>
              <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.role || 'member'}</div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>
    </header>
  );
}
