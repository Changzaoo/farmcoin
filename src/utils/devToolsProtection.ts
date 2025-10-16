/**
 * Sistema de Proteção Anti-DevTools
 * Detecta e bloqueia tentativas de inspecionar o código
 */

class DevToolsProtection {
  private isDevToolsOpen = false;
  private checkInterval: number | null = null;
  private threshold = 160; // Diferença de tamanho que indica DevTools aberto

  constructor() {
    this.init();
  }

  private init() {
    // Detectar DevTools pelo tamanho da janela
    this.detectDevToolsBySize();
    
    // Detectar pelo debugger
    this.detectByDebugger();
    
    // Detectar pelo console
    this.detectByConsole();
    
    // Detectar pela performance
    this.detectByPerformance();
    
    // Iniciar monitoramento contínuo
    this.startMonitoring();
    
    // Bloquear atalhos de teclado
    this.blockKeyboardShortcuts();
    
    // Bloquear menu de contexto
    this.blockContextMenu();
    
    // Proteger contra copy/paste de código
    this.protectSourceCode();
  }

  /**
   * Detectar DevTools pelo tamanho da janela
   */
  private detectDevToolsBySize() {
    const widthThreshold = window.outerWidth - window.innerWidth > this.threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > this.threshold;
    
    if (widthThreshold || heightThreshold) {
      this.handleDevToolsDetected('size');
    }
  }

  /**
   * Detectar pelo debugger statement
   */
  private detectByDebugger() {
    const start = Date.now();
    debugger; // Se DevTools estiver aberto, vai pausar aqui
    const end = Date.now();
    
    // Se demorou mais de 100ms, DevTools está aberto
    if (end - start > 100) {
      this.handleDevToolsDetected('debugger');
    }
  }

  /**
   * Detectar pelo console
   */
  private detectByConsole() {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        this.handleDevToolsDetected('console');
        throw new Error('DevTools detected');
      }
    });
    
    // Tentar logar o elemento (só executa se console estiver aberto)
    requestIdleCallback(() => {
      console.log('%c', element);
      console.clear();
    });
  }

  /**
   * Detectar pela diferença de performance
   */
  private detectByPerformance() {
    const before = performance.now();
    // @ts-ignore
    console.profile('test');
    // @ts-ignore
    console.profileEnd('test');
    const after = performance.now();
    
    if (after - before > 10) {
      this.handleDevToolsDetected('performance');
    }
  }

  /**
   * Iniciar monitoramento contínuo
   */
  private startMonitoring() {
    // Verificar a cada 500ms
    this.checkInterval = window.setInterval(() => {
      this.detectDevToolsBySize();
      this.detectByDebugger();
    }, 500);

    // Verificar ao redimensionar
    window.addEventListener('resize', () => {
      this.detectDevToolsBySize();
    });

    // Verificar ao mudar foco
    window.addEventListener('blur', () => {
      setTimeout(() => this.detectDevToolsBySize(), 100);
    });

    // Verificar pelo Firebug (antigo)
    if ((window as any).Firebug && (window as any).Firebug.chrome && (window as any).Firebug.chrome.isInitialized) {
      this.handleDevToolsDetected('firebug');
    }

    // Detectar extensões de desenvolvedor
    this.detectDevExtensions();
  }

  /**
   * Detectar extensões de desenvolvedor
   */
  private detectDevExtensions() {
    const checkExtension = () => {
      // React DevTools
      if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        this.handleDevToolsDetected('react-devtools');
      }
      
      // Redux DevTools
      if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
        this.handleDevToolsDetected('redux-devtools');
      }
      
      // Vue DevTools
      if ((window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        this.handleDevToolsDetected('vue-devtools');
      }
    };

    checkExtension();
    setTimeout(checkExtension, 1000);
  }

  /**
   * Bloquear atalhos de teclado comuns
   */
  private blockKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        this.handleDevToolsDetected('f12');
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.handleDevToolsDetected('ctrl-shift-i');
        return false;
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.handleDevToolsDetected('ctrl-shift-j');
        return false;
      }

      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.handleDevToolsDetected('ctrl-shift-c');
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        this.handleDevToolsDetected('ctrl-u');
        return false;
      }

      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 'S') {
        e.preventDefault();
        return false;
      }

      // F1 (ajuda que pode abrir DevTools em alguns navegadores)
      if (e.key === 'F1' || e.keyCode === 112) {
        e.preventDefault();
        return false;
      }
    }, true);
  }

  /**
   * Bloquear menu de contexto (botão direito)
   */
  private blockContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleDevToolsDetected('contextmenu');
      return false;
    }, true);

    // Bloquear também em mobile (long press)
    let pressTimer: number | null = null;
    document.addEventListener('touchstart', (e) => {
      pressTimer = window.setTimeout(() => {
        e.preventDefault();
      }, 500);
    });

    document.addEventListener('touchend', () => {
      if (pressTimer) clearTimeout(pressTimer);
    });
  }

  /**
   * Proteger código fonte
   */
  private protectSourceCode() {
    // Desabilitar seleção de texto
    document.addEventListener('selectstart', (e) => {
      if ((e.target as HTMLElement).tagName !== 'INPUT' && 
          (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    });

    // Bloquear copy
    document.addEventListener('copy', (e) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 50) {
        e.preventDefault();
        e.clipboardData?.setData('text/plain', 'Cópia não permitida');
        return false;
      }
    });

    // Bloquear print
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      document.body.style.display = 'none';
    });

    window.addEventListener('afterprint', () => {
      document.body.style.display = 'block';
    });

    // Ofuscar console
    this.obfuscateConsole();
  }

  /**
   * Ofuscar console
   */
  private obfuscateConsole() {
    // Sobrescrever console.log
    const noop = () => {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeStamp', 'profile', 'profileEnd', 'clear', 'count'];
    
    methods.forEach(method => {
      (console as any)[method] = noop;
    });

    // Definir propriedades que detectam tentativas de acesso
    Object.defineProperty(console, 'log', {
      get: () => {
        this.handleDevToolsDetected('console-access');
        return noop;
      }
    });
  }

  /**
   * Handler quando DevTools é detectado
   */
  private handleDevToolsDetected(method: string) {
    if (this.isDevToolsOpen) return; // Evitar múltiplas detecções
    
    this.isDevToolsOpen = true;
    console.clear();

    // Limpar interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Log para desenvolvimento (será removido em produção)
    if (process.env.NODE_ENV === 'development') {
      console.warn(`DevTools detectado via: ${method}`);
    }

    // Redirecionar para página de bloqueio
    this.redirectToBlockedPage();
  }

  /**
   * Redirecionar para página de bloqueio
   */
  private redirectToBlockedPage() {
    // Salvar estado atual para a página de bloqueio verificar
    sessionStorage.setItem('devtools-detected', 'true');
    sessionStorage.setItem('devtools-block-until', (Date.now() + 30000).toString());

    // Limpar console antes de redirecionar
    console.clear();

    // Redirecionar para blocked.html
    window.location.href = '/blocked.html';
  }

  /**
   * Verificar se DevTools estava aberto ao carregar
   */
  static checkOnLoad(): boolean {
    const blockUntil = sessionStorage.getItem('devtools-block-until');
    
    if (blockUntil) {
      const blockTime = parseInt(blockUntil);
      const now = Date.now();
      
      // Se ainda estiver dentro do período de bloqueio
      if (now < blockTime) {
        return true;
      } else {
        // Limpar flags antigas
        sessionStorage.removeItem('devtools-detected');
        sessionStorage.removeItem('devtools-block-until');
      }
    }
    
    return false;
  }

  /**
   * Destruir proteção (para desenvolvimento)
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Exportar instância singleton
export const devToolsProtection = new DevToolsProtection();

// Verificar ao carregar
if (DevToolsProtection.checkOnLoad()) {
  devToolsProtection['redirectToBlockedPage']();
}

// Prevenir que o objeto seja modificado
Object.freeze(devToolsProtection);
