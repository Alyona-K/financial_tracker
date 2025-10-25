import React from "react";

type ErrorBoundaryState = { hasError: boolean };
type ErrorBoundaryProps = { children: React.ReactNode };

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
