'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching React errors
 * Prevents entire app crash from component errors
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md bg-red-900/20 border border-red-700 rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Erreur Application
              </h2>
              <p className="text-gray-300 text-sm">
                Une erreur inattendue s&apos;est produite. Veuillez réessayer.
              </p>
            </div>

            <div className="bg-gray-900 rounded p-3 text-xs text-gray-400 font-mono overflow-auto max-h-32">
              {this.state.error.message}
            </div>

            <div className="flex gap-2">
              <button
                onClick={this.retry}
                className="flex-1 px-4 py-2 bg-[#d4af37] text-black font-medium rounded hover:bg-yellow-500 transition"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-700 text-white font-medium rounded hover:bg-gray-600 transition"
              >
                Accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
