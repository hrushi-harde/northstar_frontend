const config = {
  low:      { label: 'Low Risk',      bg: 'var(--success-soft)', text: 'var(--success)' },
  medium:   { label: 'Medium Risk',   bg: 'var(--warning-soft)', text: 'var(--warning)' },
  high:     { label: 'High Risk',     bg: 'var(--danger-soft)',  text: 'var(--danger)' },
  critical: { label: 'Critical Risk', bg: 'var(--danger-soft)',  text: 'var(--danger)' },
};

export default function RiskBadge({ level }) {
  const c = config[level] || config.low;
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{ background: c.bg, color: c.text, borderColor: `${c.text}30` }}>
      {c.label}
    </span>
  );
}
