import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'wouter';
import { Coffee, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* Tea cup icon with animation */}
            <div className="relative mb-8 inline-block">
              <div className="w-24 h-24 mx-auto bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              {/* Steam animation */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                <div 
                  className="w-1 h-4 bg-[var(--color-primary)]/30 rounded-full"
                  style={{ animation: 'steam 1.5s ease-in-out infinite' }}
                />
                <div 
                  className="w-1 h-6 bg-[var(--color-primary)]/30 rounded-full"
                  style={{ animation: 'steam 1.5s ease-in-out infinite 0.3s' }}
                />
                <div 
                  className="w-1 h-4 bg-[var(--color-primary)]/30 rounded-full"
                  style={{ animation: 'steam 1.5s ease-in-out infinite 0.6s' }}
                />
              </div>
            </div>

            {/* Error message */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
              Щось пішло не так
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Схоже, чай трохи перегрівся. Спробуйте оновити сторінку або поверніться на головну.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-black rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
              >
                <RefreshCw className="w-5 h-5" />
                Спробувати знову
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
              >
                <Home className="w-5 h-5" />
                Повернутись на головну
              </Link>
            </div>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  Деталі помилки (dev only)
                </summary>
                <pre className="mt-2 p-4 bg-[var(--bg-secondary)] rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          <style>{`
            @keyframes steam {
              0%, 100% {
                opacity: 0;
                transform: translateY(0) scaleY(1);
              }
              50% {
                opacity: 1;
                transform: translateY(-8px) scaleY(1.2);
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
