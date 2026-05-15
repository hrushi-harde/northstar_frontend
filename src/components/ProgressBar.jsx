import { motion } from 'framer-motion';

export default function ProgressBar({ value, color }) {
  const getColor = () => {
    if (color) return color;
    if (value >= 75) return 'var(--success)';
    if (value >= 50) return 'var(--accent)';
    if (value >= 25) return 'var(--warning)';
    return 'var(--danger)';
  };
  const c = getColor();
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: c }}
      />
    </div>
  );
}
