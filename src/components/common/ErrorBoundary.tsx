import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error caught by boundary - handled by UI
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <ErrorMessage message={this.state.error?.message || 'Algo deu errado'} />
        </div>
      );
    }

    return this.props.children;
  }
}

