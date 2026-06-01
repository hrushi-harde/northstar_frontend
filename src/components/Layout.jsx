import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ns_sidebar') === 'collapsed');

  useEffect(() => {
    localStorage.setItem('ns_sidebar', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed]);

  return (
    <div className="page-shell min-h-screen theme-transition" style={{ background: 'var(--bg-base)' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <motion.main
        animate={{ marginLeft: collapsed ? 112 : 320 }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="min-h-screen"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
