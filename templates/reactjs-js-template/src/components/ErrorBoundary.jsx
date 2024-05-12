import { Component } from 'react';

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {import('react').ReactNode} [children]
 * @property {import('react').ReactNode | import('react').ComponentType<{ error: unknown }>} fallback
 */

/**
 * @typedef {Object} ErrorBoundaryState
 * @property [error]
 */

export class ErrorBoundary extends Component {
  /**
   * @type ErrorBoundaryState
   */
  state = {};

  /**
   * @param error
   * @returns {ErrorBoundaryState}
   */
  static getDerivedStateFromError = (error) => ({ error });

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const {
      state: {
        error,
      },
      props: {
        fallback: Fallback,
        children,
      },
    } = this;

    return 'error' in this.state
      ? typeof Fallback === 'function'
        ? <Fallback error={error} />
        : Fallback
      : children;
  }
}
