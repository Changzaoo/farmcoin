/**
 * Sistema Anti-Bot e Rate Limiting
 * Protege contra auto-clickers, bots e ataques DDoS
 */

interface ClickData {
  timestamp: number;
  count: number;
}

interface UserBehavior {
  clicks: ClickData[];
  lastClickTime: number;
  clickPattern: number[];
  suspicionLevel: number;
  blocked: boolean;
  blockedUntil?: number;
}

class AntiBotSystem {
  private static instance: AntiBotSystem;
  private userBehaviors: Map<string, UserBehavior> = new Map();
  
  // Configurações de limite
  private readonly MAX_CLICKS_PER_SECOND = 14;
  private readonly WINDOW_SIZE = 1000; // 1 segundo
  private readonly PATTERN_ANALYSIS_WINDOW = 10; // últimos 10 clicks
  private readonly SUSPICION_THRESHOLD = 3; // 3 violações = bloqueio
  private readonly BLOCK_DURATION = 60000; // 1 minuto de bloqueio
  private readonly DDOS_THRESHOLD = 100; // 100 requests em 1 segundo = DDoS
  
  private constructor() {
    // Limpar dados antigos a cada 5 minutos
    setInterval(() => this.cleanup(), 300000);
  }

  static getInstance(): AntiBotSystem {
    if (!AntiBotSystem.instance) {
      AntiBotSystem.instance = new AntiBotSystem();
    }
    return AntiBotSystem.instance;
  }

  /**
   * Verifica se o click é válido
   */
  validateClick(userId: string): { allowed: boolean; reason?: string; warning?: string } {
    const now = Date.now();
    let behavior = this.userBehaviors.get(userId);

    // Inicializar comportamento do usuário se não existir
    if (!behavior) {
      behavior = {
        clicks: [],
        lastClickTime: now,
        clickPattern: [],
        suspicionLevel: 0,
        blocked: false
      };
      this.userBehaviors.set(userId, behavior);
    }

    // Verificar se está bloqueado
    if (behavior.blocked) {
      if (behavior.blockedUntil && now < behavior.blockedUntil) {
        const remainingTime = Math.ceil((behavior.blockedUntil - now) / 1000);
        return {
          allowed: false,
          reason: `🚫 Bloqueado por comportamento suspeito. Aguarde ${remainingTime}s`
        };
      } else {
        // Desbloquear
        behavior.blocked = false;
        behavior.blockedUntil = undefined;
        behavior.suspicionLevel = 0;
        behavior.clicks = [];
      }
    }

    // Remover clicks antigos (fora da janela de 1 segundo)
    behavior.clicks = behavior.clicks.filter(click => now - click.timestamp < this.WINDOW_SIZE);

    // Verificar rate limiting
    const clicksInWindow = behavior.clicks.reduce((sum, click) => sum + click.count, 0);
    
    if (clicksInWindow >= this.MAX_CLICKS_PER_SECOND) {
      behavior.suspicionLevel++;
      
      if (behavior.suspicionLevel >= this.SUSPICION_THRESHOLD) {
        // Bloquear usuário
        behavior.blocked = true;
        behavior.blockedUntil = now + this.BLOCK_DURATION;
        
        console.warn(`🚨 Usuário ${userId} bloqueado por bot detection`);
        
        return {
          allowed: false,
          reason: '🤖 Bot detectado! Você foi bloqueado por 1 minuto.'
        };
      }

      return {
        allowed: false,
        reason: `⚠️ Muitos clicks! Limite: ${this.MAX_CLICKS_PER_SECOND}/segundo`,
        warning: `Suspeição: ${behavior.suspicionLevel}/${this.SUSPICION_THRESHOLD}`
      };
    }

    // Analisar padrão de clicks (detectar auto-clickers)
    const timeSinceLastClick = now - behavior.lastClickTime;
    behavior.clickPattern.push(timeSinceLastClick);
    
    if (behavior.clickPattern.length > this.PATTERN_ANALYSIS_WINDOW) {
      behavior.clickPattern.shift();
    }

    // Detectar padrões mecânicos (intervalos muito regulares)
    if (this.detectMechanicalPattern(behavior.clickPattern)) {
      behavior.suspicionLevel++;
      
      if (behavior.suspicionLevel >= this.SUSPICION_THRESHOLD) {
        behavior.blocked = true;
        behavior.blockedUntil = now + this.BLOCK_DURATION;
        
        return {
          allowed: false,
          reason: '🤖 Auto-clicker detectado! Bloqueado por 1 minuto.'
        };
      }

      return {
        allowed: true, // Permitir, mas avisar
        warning: '⚠️ Padrão de clicks suspeito detectado!'
      };
    }

    // Registrar click válido
    behavior.clicks.push({ timestamp: now, count: 1 });
    behavior.lastClickTime = now;

    // Reduzir suspeição gradualmente para clicks normais
    if (behavior.suspicionLevel > 0 && timeSinceLastClick > 200) {
      behavior.suspicionLevel = Math.max(0, behavior.suspicionLevel - 0.1);
    }

    return { allowed: true };
  }

  /**
   * Detecta padrões mecânicos (auto-clickers)
   */
  private detectMechanicalPattern(pattern: number[]): boolean {
    if (pattern.length < 5) return false;

    // Calcular variância dos intervalos
    const mean = pattern.reduce((a, b) => a + b, 0) / pattern.length;
    const variance = pattern.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pattern.length;
    const stdDev = Math.sqrt(variance);

    // Se desvio padrão muito baixo = padrão mecânico
    // Intervalos muito regulares (< 10ms de variação) = auto-clicker
    if (stdDev < 10 && mean < 100) {
      return true;
    }

    // Detectar sequências idênticas (sinal de macro)
    const uniqueIntervals = new Set(pattern);
    if (uniqueIntervals.size === 1 || uniqueIntervals.size === 2) {
      return true;
    }

    return false;
  }

  /**
   * Proteção DDoS - verificar requests excessivos
   */
  validateRequest(userId: string, endpoint: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const behavior = this.userBehaviors.get(userId);

    if (!behavior) return { allowed: true };

    // Contar requests na última janela
    const recentClicks = behavior.clicks.filter(click => now - click.timestamp < this.WINDOW_SIZE);
    const totalRequests = recentClicks.reduce((sum, click) => sum + click.count, 0);

    if (totalRequests > this.DDOS_THRESHOLD) {
      console.error(`🚨 DDoS detectado de ${userId} em ${endpoint}`);
      
      behavior.blocked = true;
      behavior.blockedUntil = now + (this.BLOCK_DURATION * 5); // 5 minutos

      return {
        allowed: false,
        reason: '🛡️ Proteção DDoS ativada. Muitas requisições detectadas.'
      };
    }

    return { allowed: true };
  }

  /**
   * Limpar dados antigos
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 600000; // 10 minutos

    for (const [userId, behavior] of this.userBehaviors.entries()) {
      // Remover usuários inativos
      if (now - behavior.lastClickTime > maxAge) {
        this.userBehaviors.delete(userId);
      }
    }

    console.log(`🧹 Cleanup: ${this.userBehaviors.size} usuários ativos`);
  }

  /**
   * Obter estatísticas do usuário
   */
  getUserStats(userId: string) {
    const behavior = this.userBehaviors.get(userId);
    
    if (!behavior) {
      return {
        clicksPerSecond: 0,
        suspicionLevel: 0,
        blocked: false
      };
    }

    const now = Date.now();
    const recentClicks = behavior.clicks.filter(click => now - click.timestamp < this.WINDOW_SIZE);
    const clicksPerSecond = recentClicks.reduce((sum, click) => sum + click.count, 0);

    return {
      clicksPerSecond,
      suspicionLevel: behavior.suspicionLevel,
      blocked: behavior.blocked,
      blockedUntil: behavior.blockedUntil
    };
  }

  /**
   * Resetar bloqueio (admin)
   */
  resetUser(userId: string): void {
    const behavior = this.userBehaviors.get(userId);
    if (behavior) {
      behavior.blocked = false;
      behavior.blockedUntil = undefined;
      behavior.suspicionLevel = 0;
      behavior.clicks = [];
      console.log(`✅ Usuário ${userId} desbloqueado`);
    }
  }
}

export const antiBot = AntiBotSystem.getInstance();
