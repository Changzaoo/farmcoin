/**
 * Classe customizada de erro para o jogo
 */
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameError';
  }
}

/**
 * Wrapper que adiciona error boundary em funções
 */
export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  fallback?: (...args: Parameters<T>) => ReturnType<T>
): T => {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);

      // Handle promises
      if (result instanceof Promise) {
        return result.catch((error) => {
          console.error(`❌ Erro em ${fn.name}:`, error);
          if (fallback) return fallback(...args);
          throw error;
        });
      }

      return result;
    } catch (error) {
      console.error(`❌ Erro em ${fn.name}:`, error);
      if (fallback) return fallback(...args);
      throw error;
    }
  }) as T;
};

/**
 * Logger de erros com contexto
 */
export const logError = (
  error: Error | GameError,
  context?: Record<string, any>
) => {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  };

  console.error('🔥 ERRO DO JOGO:', errorData);

  // Aqui você pode adicionar integração com Sentry, LogRocket, etc.
  // Exemplo: Sentry.captureException(error, { extra: context });
};

/**
 * Wrapper para operações assíncronas com retry
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Tentativa ${attempt}/${maxRetries} falhou:`, error);

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw new GameError(
    `Falha após ${maxRetries} tentativas: ${lastError!.message}`,
    'MAX_RETRIES_EXCEEDED',
    { maxRetries, lastError: lastError!.message }
  );
};
