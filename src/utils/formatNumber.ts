/**
 * 💰 Formatação de Números
 * Converte números grandes em formato abreviado (K, M, B, T)
 */

/**
 * Formata números grandes com abreviações
 * @param num - Número a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada
 * 
 * @example
 * formatNumber(1234) // "1.23K"
 * formatNumber(1234567) // "1.23M"
 * formatNumber(1234567890) // "1.23B"
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  if (num === 0) return '0';
  if (num < 0) return `-${formatNumber(Math.abs(num), decimals)}`;
  
  const suffixes = [
    { value: 1e12, symbol: 'T' },  // Trilhão
    { value: 1e9, symbol: 'B' },   // Bilhão
    { value: 1e6, symbol: 'M' },   // Milhão
    { value: 1e3, symbol: 'K' },   // Mil
  ];

  for (const { value, symbol } of suffixes) {
    if (num >= value) {
      const formatted = (num / value).toFixed(decimals);
      // Remove zeros desnecessários
      return formatted.replace(/\.?0+$/, '') + symbol;
    }
  }

  // Números menores que 1000
  if (num < 10) {
    return num.toFixed(decimals).replace(/\.?0+$/, '');
  }
  
  return num.toFixed(0);
};

/**
 * Formata número como moeda
 * @param num - Número a ser formatado
 * @returns String formatada com símbolo de moeda
 */
export const formatCurrency = (num: number): string => {
  return `💰 ${formatNumber(num)}`;
};

/**
 * Formata número como porcentagem
 * @param num - Número a ser formatado (0-100)
 * @returns String formatada com %
 */
export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

/**
 * Formata número com separadores de milhares
 * @param num - Número a ser formatado
 * @returns String formatada com pontos
 */
export const formatWithSeparators = (num: number): string => {
  return num.toLocaleString('pt-BR');
};
