import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md glass-card rounded-2xl p-8">
            <div className="w-14 h-14 bg-[var(--danger)]/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[var(--danger)]/30">
              <AlertTriangle size={24} className="text-[var(--danger)]" />
            </div>
            <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
              Something went wrong
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-medium mb-6 leading-relaxed">
              An unexpected error occurred. This usually fixes itself with a refresh.
            </p>
            {this.state.error && (
              <div className="mb-5 p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg text-left">
                <code className="text-xs text-[var(--danger)] font-mono break-all">
                  {this.state.error.message || 'Unknown error'}
                </code>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--accent-light)] transition-mindflow glow-shadow"
              >
                <RefreshCw size={14} /> Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 glass-card text-[var(--text-primary)] rounded-xl text-sm font-semibold hover:border-[var(--border-accent)] transition-mindflow"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
