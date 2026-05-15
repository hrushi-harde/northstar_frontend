import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 theme-transition"
          style={{ background: 'var(--bg-base)' }}>
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)30' }}>
              <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Something went wrong
            </div>
            <div className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white mx-auto btn-primary">
              <RefreshCw size={14} /> Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
