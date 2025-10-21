/**
 * 🎮 Sistema de Feedback Háptico
 * Adiciona vibrações sutis em dispositivos móveis para melhorar a experiência
 */

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Padrões de vibração para diferentes tipos de feedback
 */
const HAPTIC_PATTERNS: Record<HapticFeedbackType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [50, 100, 50, 100, 50]
};

/**
 * Verifica se o dispositivo suporta feedback háptico
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Dispara feedback háptico se o dispositivo suportar
 */
export const triggerHaptic = (type: HapticFeedbackType = 'light'): void => {
  if (!isHapticSupported()) return;

  const pattern = HAPTIC_PATTERNS[type];
  
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Silenciosamente falha se não suportado
    console.warn('Haptic feedback não suportado:', error);
  }
};

/**
 * Hook personalizado para feedback háptico
 */
export const useHaptic = () => {
  const supported = isHapticSupported();

  return {
    isSupported: supported,
    trigger: triggerHaptic,
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error')
  };
};
