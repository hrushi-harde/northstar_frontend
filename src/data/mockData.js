export const currentUser = {
  id: 'u1',
  name: 'Sarah Chen',
  role: 'executive',
  avatar: 'SC',
  email: 'sarah.chen@northstar.io',
  title: 'Chief Executive Officer',
};

export const users = [
  { id: 'u1', name: 'Sarah Chen', role: 'executive', avatar: 'SC', title: 'CEO', department: 'Executive' },
  { id: 'u2', name: 'Marcus Webb', role: 'manager', avatar: 'MW', title: 'Engineering Manager', department: 'Engineering' },
  { id: 'u3', name: 'Priya Nair', role: 'manager', avatar: 'PN', title: 'Product Manager', department: 'Product' },
  { id: 'u4', name: 'James Liu', role: 'employee', avatar: 'JL', title: 'Senior Engineer', department: 'Engineering' },
  { id: 'u5', name: 'Aisha Okafor', role: 'employee', avatar: 'AO', title: 'Frontend Engineer', department: 'Engineering' },
  { id: 'u6', name: 'Tom Reyes', role: 'employee', avatar: 'TR', title: 'QA Engineer', department: 'QA' },
  { id: 'u7', name: 'Elena Vasquez', role: 'employee', avatar: 'EV', title: 'Backend Engineer', department: 'Engineering' },
  { id: 'u8', name: 'David Kim', role: 'employee', avatar: 'DK', title: 'DevOps Engineer', department: 'Platform' },
];

export const projects = [
  {
    id: 'p1',
    name: 'Project Orion',
    description: 'Next-gen customer platform with AI-powered personalization engine',
    manager: 'u2',
    team: ['u4', 'u5', 'u7'],
    health: 'at-risk',
    progress: 62,
    risk: 'high',
    blockers: 3,
    department: 'Engineering',
    deadline: '2026-06-30',
    morale: 58,
    lastUpdate: '2 hours ago',
    tags: ['AI', 'Platform', 'Q2'],
  },
  {
    id: 'p2',
    name: 'Atlas Redesign',
    description: 'Complete UI/UX overhaul of the core product dashboard',
    manager: 'u3',
    team: ['u5', 'u6'],
    health: 'healthy',
    progress: 81,
    risk: 'low',
    blockers: 0,
    department: 'Product',
    deadline: '2026-05-28',
    morale: 84,
    lastUpdate: '45 min ago',
    tags: ['Design', 'UX', 'Q2'],
  },
  {
    id: 'p3',
    name: 'Infra Migration',
    description: 'Kubernetes migration and cloud infrastructure modernization',
    manager: 'u2',
    team: ['u7', 'u8'],
    health: 'blocked',
    progress: 34,
    risk: 'critical',
    blockers: 5,
    department: 'Platform',
    deadline: '2026-07-15',
    morale: 42,
    lastUpdate: '1 hour ago',
    tags: ['Infrastructure', 'DevOps', 'Q3'],
  },
  {
    id: 'p4',
    name: 'Payments v3',
    description: 'Stripe integration upgrade with multi-currency support',
    manager: 'u3',
    team: ['u4', 'u6'],
    health: 'healthy',
    progress: 91,
    risk: 'low',
    blockers: 1,
    department: 'Engineering',
    deadline: '2026-05-20',
    morale: 76,
    lastUpdate: '3 hours ago',
    tags: ['Payments', 'Integration', 'Q2'],
  },
  {
    id: 'p5',
    name: 'ML Pipeline',
    description: 'Real-time ML inference pipeline for recommendation engine',
    manager: 'u2',
    team: ['u4', 'u7', 'u8'],
    health: 'at-risk',
    progress: 47,
    risk: 'medium',
    blockers: 2,
    department: 'Engineering',
    deadline: '2026-08-01',
    morale: 65,
    lastUpdate: '5 hours ago',
    tags: ['ML', 'Data', 'Q3'],
  },
];

export const updates = [
  {
    id: 'upd1',
    projectId: 'p1',
    userId: 'u4',
    timestamp: '2026-05-15T10:30:00',
    messages: [
      { role: 'user', content: 'Reviewed 5 PRs today but deployment is blocked due to QA environment issues. The staging server keeps timing out on the auth service.' },
      { role: 'ai', content: 'Thanks James. I\'m detecting a deployment blocker here. A few follow-up questions:\n\n1. How long has the staging server been timing out?\n2. Is this affecting other team members too?\n3. Have you escalated to DevOps yet?' },
      { role: 'user', content: 'It\'s been happening since yesterday afternoon. Yes, Aisha is also blocked. I pinged David but no response yet.' },
      { role: 'ai', content: 'Got it. I\'ve flagged this as a team-wide blocker on Project Orion. Signals detected:\n\n🔴 Deployment blocked — staging auth service timeout\n👥 2 engineers affected (James Liu, Aisha Okafor)\n⚠️ Escalation pending — DevOps unresponsive\n\nThis is increasing delivery risk for the Q2 deadline. I\'ll surface this to Marcus.' },
    ],
    signals: ['deployment-blocked', 'team-blocker', 'escalation-needed'],
    extractedMetrics: { prsReviewed: 5, blockers: 1, riskLevel: 'high' },
  },
  {
    id: 'upd2',
    projectId: 'p3',
    userId: 'u8',
    timestamp: '2026-05-15T09:15:00',
    messages: [
      { role: 'user', content: 'K8s cluster migration is stuck. The persistent volume claims are failing on the new nodes and I can\'t figure out why. Been on this for 2 days.' },
      { role: 'ai', content: 'That sounds frustrating. Two days on a single blocker is significant. Can you tell me:\n\n1. What error are you seeing on the PVC failures?\n2. Have you checked the storage class configuration?\n3. Is this blocking the entire migration or just specific services?' },
      { role: 'user', content: 'StorageClass mismatch between old and new cluster. It\'s blocking everything — can\'t migrate any stateful services until this is resolved.' },
      { role: 'ai', content: 'Critical blocker identified. This is a full migration halt.\n\n🔴 CRITICAL: StorageClass mismatch blocking entire K8s migration\n📅 2 days lost — significant schedule impact\n🚨 All stateful service migrations halted\n\nRecommendation: Escalate immediately to infrastructure lead. This may require vendor support.' },
    ],
    signals: ['critical-blocker', 'schedule-impact', 'escalation-required'],
    extractedMetrics: { daysBlocked: 2, blockers: 1, riskLevel: 'critical' },
  },
];

export const aiInsights = [
  { id: 'i1', severity: 'critical', project: 'Infra Migration', message: 'Critical blocker detected: K8s StorageClass mismatch halting entire migration. 2 days of schedule impact.', time: '1h ago', icon: '🔴' },
  { id: 'i2', severity: 'high', project: 'Project Orion', message: 'Deployment pipeline blocked for 18+ hours. 2 engineers idle. Q2 deadline at risk.', time: '2h ago', icon: '🟠' },
  { id: 'i3', severity: 'medium', project: 'ML Pipeline', message: 'Team morale dropped 12 points this week. Workload indicators suggest burnout risk.', time: '4h ago', icon: '🟡' },
  { id: 'i4', severity: 'info', project: 'Atlas Redesign', message: 'On track for delivery. Team morale at 84 — highest across all projects this week.', time: '6h ago', icon: '🟢' },
  { id: 'i5', severity: 'high', project: 'Organization', message: 'QA blockers increased 27% this week across Engineering and Platform teams.', time: '8h ago', icon: '🟠' },
];

export const moraleHistory = [
  { week: 'W1', engineering: 72, product: 80, platform: 65, qa: 70 },
  { week: 'W2', engineering: 68, product: 82, platform: 58, qa: 66 },
  { week: 'W3', engineering: 65, product: 79, platform: 52, qa: 71 },
  { week: 'W4', engineering: 61, product: 84, platform: 45, qa: 68 },
  { week: 'W5', engineering: 63, product: 83, platform: 42, qa: 65 },
];

export const projectHealthHistory = [
  { week: 'W1', healthy: 4, atRisk: 1, blocked: 0 },
  { week: 'W2', healthy: 3, atRisk: 2, blocked: 0 },
  { week: 'W3', healthy: 3, atRisk: 1, blocked: 1 },
  { week: 'W4', healthy: 2, atRisk: 2, blocked: 1 },
  { week: 'W5', healthy: 2, atRisk: 2, blocked: 1 },
];

export const blockerDistribution = [
  { name: 'Infrastructure', value: 5, color: '#ef4444' },
  { name: 'QA / Testing', value: 4, color: '#f97316' },
  { name: 'Dependencies', value: 3, color: '#eab308' },
  { name: 'Design Review', value: 1, color: '#6366f1' },
];

export const departmentActivity = [
  { dept: 'Engineering', updates: 24, blockers: 5, morale: 63 },
  { dept: 'Platform', updates: 12, blockers: 5, morale: 42 },
  { dept: 'Product', updates: 18, blockers: 1, morale: 84 },
  { dept: 'QA', updates: 9, blockers: 4, morale: 65 },
];

export const activityFeed = [
  { id: 'a1', user: 'James Liu', action: 'submitted update', project: 'Project Orion', time: '2m ago', type: 'update' },
  { id: 'a2', user: 'AI', action: 'detected critical blocker', project: 'Infra Migration', time: '1h ago', type: 'alert' },
  { id: 'a3', user: 'David Kim', action: 'submitted update', project: 'Infra Migration', time: '1h ago', type: 'update' },
  { id: 'a4', user: 'Aisha Okafor', action: 'reported blocker', project: 'Project Orion', time: '2h ago', type: 'blocker' },
  { id: 'a5', user: 'AI', action: 'generated weekly summary', project: 'All Projects', time: '3h ago', type: 'ai' },
  { id: 'a6', user: 'Elena Vasquez', action: 'submitted update', project: 'ML Pipeline', time: '5h ago', type: 'update' },
  { id: 'a7', user: 'Tom Reyes', action: 'resolved blocker', project: 'Payments v3', time: '6h ago', type: 'resolved' },
];

export const aiSuggestedResponses = [
  "Deployment is still blocked, waiting on DevOps.",
  "Made progress on the auth service fix.",
  "Escalated to the infrastructure team.",
  "No blockers today, on track.",
];
