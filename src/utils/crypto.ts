/**
 * Utilitário de criptografia SHA-512
 * Implementação segura para hashing de senhas
 */

/**
 * Converte uma string para ArrayBuffer
 */
async function stringToArrayBuffer(str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  return uint8Array.buffer;
}

/**
 * Converte ArrayBuffer para string hexadecimal
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

/**
 * Gera um salt aleatório
 */
export function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return arrayBufferToHex(array.buffer as ArrayBuffer);
}

/**
 * Hash de senha com SHA-512
 * @param password - Senha em texto plano
 * @param salt - Salt para adicionar à senha
 * @returns Hash SHA-512 da senha com salt
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const saltedPassword = password + salt;
  const buffer = await stringToArrayBuffer(saltedPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
  return arrayBufferToHex(hashBuffer);
}

/**
 * Verifica se a senha corresponde ao hash
 * @param password - Senha em texto plano
 * @param salt - Salt usado no hash original
 * @param hash - Hash armazenado
 * @returns true se a senha corresponder ao hash
 */
export async function verifyPassword(
  password: string, 
  salt: string, 
  hash: string
): Promise<boolean> {
  const newHash = await hashPassword(password, salt);
  return newHash === hash;
}

/**
 * Gera um hash completo com salt incluído
 * Formato: salt$hash
 */
export async function createPasswordHash(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  return `${salt}$${hash}`;
}

/**
 * Verifica senha contra hash completo
 * @param password - Senha em texto plano
 * @param storedHash - Hash armazenado no formato salt$hash
 */
export async function verifyPasswordHash(
  password: string, 
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split('$');
  if (!salt || !hash) {
    throw new Error('Formato de hash inválido');
  }
  return verifyPassword(password, salt, hash);
}

/**
 * Gera um ID único seguro
 */
export function generateSecureId(): string {
  return generateSalt(16);
}
