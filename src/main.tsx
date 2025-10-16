// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

console.log('🚀 main.tsx: Iniciando aplicação...');

try {
  const rootElement = document.getElementById('root');
  console.log('🔍 main.tsx: Root element found:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
  
  console.log('✅ main.tsx: App renderizado com sucesso!');
} catch (error) {
  console.error('❌ main.tsx: Erro ao renderizar:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">Erro ao carregar FarmCoin</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}
