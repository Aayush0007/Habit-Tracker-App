import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Something went wrong.</h2>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 px-4 py-2 rounded-lg text-black font-bold"
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;