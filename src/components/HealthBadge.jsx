const config = {
  healthy:  { label: 'Healthy',  bg: 'var(--success-soft)', text: 'var(--success)', dot: 'var(--success)' },
  'at-risk':{ label: 'At Risk',  bg: 'var(--warning-soft)', text: 'var(--warning)', dot: 'var(--warning)' },
  blocked:  { label: 'Blocked',  bg: 'var(--danger-soft)',  text: 'var(--danger)',  dot: 'var(--danger)' },
  critical: { label: 'Critical', bg: 'var(--danger-soft)',  text: 'var(--danger)',  dot: 'var(--danger)' },
};

export default function HealthBadge({ status }) {
  const c = config[status] || config.healthy;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
