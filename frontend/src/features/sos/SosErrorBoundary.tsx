'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SosErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SOS System ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fail silently so the rest of the application functions 100% normally
      return null;
    }
    return this.props.children;
  }
}

