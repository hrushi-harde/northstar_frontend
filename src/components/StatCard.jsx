import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, sub, icon: Icon, trend, color = 'var(--accent)', delay = 0 }) {
  const isPositive = trend > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="premium-card premium-card-interactive p-5 cursor-default theme-transition"
      style={{
        minHeight: 148,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70" style={{ background: `linear-gradient(90deg, ${color}, var(--accent), var(--purple))` }} />
      <div className="relative flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center glow-accent"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full`}
            style={{
              background: isPositive ? 'var(--success-soft)' : 'var(--danger-soft)',
              color: isPositive ? 'var(--success)' : 'var(--danger)',
            }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-semibold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sub && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
    </motion.div>
  );
}
