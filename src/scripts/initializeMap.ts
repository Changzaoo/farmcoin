// Script para inicializar o mapa com 2500 terrenos
// Execute este arquivo uma vez para criar os terrenos no Firestore

import { initializeLands } from '../firebase/firestore';

async function setupMap() {
  console.log('🗺️ Iniciando criação do mapa...');
  console.log('⚠️ Isso pode levar alguns minutos...');
  
  try {
    await initializeLands();
    console.log('✅ Mapa criado com sucesso!');
    console.log('📊 2500 terrenos foram adicionados ao Firestore');
  } catch (error: any) {
    console.error('❌ Erro ao criar mapa:', error.message);
  }
}

setupMap();
