import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Shield, BarChart3, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const roles = [
  { label: 'Executive', email: 'sarah.chen@northstar.io', desc: 'Org-wide visibility & analytics', icon: BarChart3, color: 'var(--purple)' },
  { label: 'Manager',   email: 'marcus.webb@northstar.io', desc: 'Team & project management',      icon: Shield,    color: 'var(--accent)' },
  { label: 'Employee',  email: 'james.liu@northstar.io',   desc: 'Submit updates & track work',    icon: MessageSquare, color: 'var(--info)' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen flex theme-transition" style={{ background: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)', borderRight: '1px solid var(--border)' }}>
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--purple), transparent)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>NorthStar</div>
              <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Operational Intelligence</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            AI-powered<br />
            <span className="gradient-text">operational clarity</span><br />
            for your org.
          </h2>
          <p className="text-base leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
            Real-time project health, blocker detection, morale tracking, and AI-generated insights — all in one place.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { icon: '🔴', text: 'Blocker detection in real-time' },
            { icon: '🤖', text: 'AI follow-up questions & signal extraction' },
            { icon: '📊', text: 'Executive-grade operational analytics' },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
              <span className="text-lg">{f.icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>NorthStar</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Sign in to your workspace</p>

          {/* Role quick-select */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Quick demo login
            </div>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(role => {
                const isSelected = email === role.email;
                return (
                  <motion.button
                    key={role.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectRole(role.email)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                      border: `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border)'}`,
                    }}
                  >
                    <role.icon size={14} style={{ color: role.color, marginBottom: 6 }} />
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{role.label}</div>
                    <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{role.desc}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)30', color: 'var(--danger)' }}>
                {error}
              </div>
            )}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.io"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-base"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all input-base"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 btn-primary"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-faint)' }}>
            Demo environment — no real data stored
          </p>
        </motion.div>
      </div>
    </div>
  );
}
