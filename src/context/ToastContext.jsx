import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const COLORS = {
  success: { border: 'var(--success)', text: 'var(--success)' },
  error:   { border: 'var(--danger)',  text: 'var(--danger)' },
  warning: { border: 'var(--warning)', text: 'var(--warning)' },
  info:    { border: 'var(--accent)',  text: 'var(--accent)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type] || Info;
            const c = COLORS[t.type] || COLORS.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-start gap-3 px-4 py-3 rounded-xl pointer-events-auto max-w-sm theme-transition"
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${c.border}50`,
                  boxShadow: 'var(--shadow-lg)',
                }}>
                <Icon size={16} style={{ color: c.text }} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm flex-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{t.message}</span>
                <button onClick={() => dismiss(t.id)} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity flex-shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
