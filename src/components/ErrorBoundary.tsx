// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary: Erro capturado:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          fontFamily: 'sans-serif',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '800px',
            backgroundColor: '#2a2a2a',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{ color: '#ff4444', marginBottom: '20px' }}>
              ⚠️ Ops! Algo deu errado
            </h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              A aplicação encontrou um erro inesperado.
            </p>
            
            <details style={{ marginBottom: '20px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                📋 Detalhes do erro
              </summary>
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                marginTop: '10px'
              }}>
                <p style={{ color: '#ff6666', marginBottom: '10px' }}>
                  <strong>Mensagem:</strong> {this.state.error?.message}
                </p>
                <pre style={{
                  fontSize: '12px',
                  color: '#aaa',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error?.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre style={{
                    fontSize: '12px',
                    color: '#aaa',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '10px'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>

            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '12px 24px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
