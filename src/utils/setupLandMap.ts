/**
 * Script para inicializar o mapa de terrenos
 * ATENÇÃO: Execute este script APENAS UMA VEZ para criar os 2500 terrenos no Firestore
 * 
 * Para executar:
 * 1. Importe esta função em algum componente temporário
 * 2. Chame initializeLandMap()
 * 3. Aguarde a conclusão (pode demorar alguns minutos)
 * 4. Remova a chamada após a execução
 */

import { initializeLandMap } from '../firebase/lands';

export async function setupLandMap() {
  console.log('🗺️ INICIANDO CRIAÇÃO DO MAPA DE TERRENOS');
  console.log('⚠️ ATENÇÃO: Este processo pode demorar alguns minutos!');
  console.log('⚠️ NÃO FECHE O NAVEGADOR até ver a mensagem de conclusão!');
  
  try {
    await initializeLandMap();
    console.log('✅ MAPA CRIADO COM SUCESSO!');
    console.log('✅ 2500 terrenos foram adicionados ao Firestore');
    console.log('✅ Você pode agora remover a chamada para setupLandMap()');
  } catch (error) {
    console.error('❌ ERRO ao criar mapa:', error);
    console.error('💡 Você pode tentar executar novamente');
  }
}

// INSTRUÇÕES DE USO:
// 
// 1. No componente FarmCoinGame ou App, adicione temporariamente:
//
//    import { setupLandMap } from './utils/setupLandMap';
//
//    useEffect(() => {
//      setupLandMap(); // EXECUTE APENAS UMA VEZ!
//    }, []);
//
// 2. Recarregue a página
// 3. Aguarde a conclusão (verifique o console)
// 4. REMOVA o código acima após a conclusão
// 5. O mapa estará pronto para uso!
