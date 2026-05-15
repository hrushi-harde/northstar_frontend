const config = {
  low:      { label: 'Low Risk',      bg: 'var(--success-soft)', text: 'var(--success)' },
  medium:   { label: 'Medium Risk',   bg: 'var(--warning-soft)', text: 'var(--warning)' },
  high:     { label: 'High Risk',     bg: 'var(--danger-soft)',  text: 'var(--danger)' },
  critical: { label: 'Critical Risk', bg: 'var(--danger-soft)',  text: 'var(--danger)' },
};

export default function RiskBadge({ level }) {
  const c = config[level] || config.low;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  );
}
