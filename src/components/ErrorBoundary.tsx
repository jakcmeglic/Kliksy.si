import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Nekaj je šlo narobe</h1>
            <p className="text-gray-700 mb-4">Prišlo je do nepričakovane napake.</p>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm text-red-800 overflow-auto max-h-64">
              {this.state.error?.message}
            </pre>
            <button
              className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Osveži stran
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
