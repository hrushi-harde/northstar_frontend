import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Command, X, Sun, Moon } from 'lucide-react';
import { api } from '../api/client';
import { useTheme } from '../context/ThemeContext';

export default function TopBar({ title, subtitle }) {
  const { theme, toggle } = useTheme();
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
    <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-30 topbar-bg theme-transition">
      <div>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <Search size={14} />
            <span className="hidden sm:block text-xs">Search...</span>
            <div className="hidden sm:flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded text-xs"
              style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
              <Command size={10} /><span>K</span>
            </div>
          </button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 rounded-xl p-3 z-50 theme-transition"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search projects, people, insights..."
                    className="bg-transparent text-sm outline-none flex-1"
                    style={{ color: 'var(--text-primary)' }} />
                  <button onClick={() => setSearchOpen(false)}>
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
                <div className="text-xs px-2 py-1 mb-1" style={{ color: 'var(--text-muted)' }}>Quick links</div>
                {['Project Orion', 'Infra Migration', 'James Liu', 'AI Insights'].map(item => (
                  <div key={item}
                    className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    {item}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setSearchOpen(false); }}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <Bell size={15} />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                style={{ background: 'var(--danger)', fontSize: '10px' }}>{criticalCount}</span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 rounded-xl overflow-hidden z-50 theme-transition"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Alerts</span>
                  <button onClick={() => setNotifOpen(false)}>
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {insights.length > 0 ? insights.map(insight => (
                    <div key={insight.id}
                      className="px-4 py-3 cursor-pointer transition-all"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div className="flex items-start gap-2">
                        <span className="text-base mt-0.5">{insight.icon}</span>
                        <div>
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {insight.project_name || insight.project || 'Organization'}
                          </div>
                          <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {insight.message}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {insight.time || 'recently'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="px-4 py-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      No alerts at this time
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
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
      </div>
    </header>
  );
}
