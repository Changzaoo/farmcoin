# ✅ Checklist de Deploy - FarmCoin

## 📋 Pré-Deploy

### Código
- [ ] ✅ Todos os erros TypeScript corrigidos
- [ ] ✅ Build local passa (`npm run build`)
- [ ] ✅ Preview funciona (`npm run preview`)
- [ ] ✅ Código commitado e pushed

### Firebase
- [ ] ✅ Projeto Firebase criado
- [ ] ✅ Firestore ativado
- [ ] ✅ Authentication ativado (Email/Password)
- [ ] ✅ Regras de segurança configuradas
- [ ] ✅ Credenciais copiadas

### Vercel
- [ ] ✅ Conta criada em vercel.com
- [ ] ✅ Repositório conectado
- [ ] ✅ Variáveis de ambiente configuradas:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
  - [ ] `VITE_FIREBASE_MEASUREMENT_ID`

## 🚀 Deploy

### Opção 1: Vercel Dashboard (Recomendado)
- [ ] Acessar [vercel.com/new](https://vercel.com/new)
- [ ] Importar repositório `Changzaoo/farmcoin`
- [ ] Configurar variáveis (Settings → Environment Variables)
- [ ] Clicar em "Deploy"
- [ ] Aguardar build (2-3 minutos)

### Opção 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## ✅ Pós-Deploy

### Testes Funcionais
- [ ] ✅ Site abre no domínio Vercel
- [ ] ✅ Login funciona
- [ ] ✅ Registro funciona
- [ ] ✅ Clique no botão funciona
- [ ] ✅ Compra de upgrades funciona
- [ ] ✅ Dados salvam no Firebase
- [ ] ✅ Renda passiva funciona
- [ ] ✅ Marketplace funciona
- [ ] ✅ Ranking funciona
- [ ] ✅ Mapa de terrenos funciona

### Performance
- [ ] ✅ Lighthouse Performance > 90
- [ ] ✅ Lighthouse Accessibility > 95
- [ ] ✅ Assets carregam rápido
- [ ] ✅ Sem erros no console

### Segurança
- [ ] ✅ HTTPS ativo
- [ ] ✅ Headers de segurança configurados
- [ ] ✅ Variáveis de ambiente ocultas
- [ ] ✅ Regras do Firestore protegem dados

### Opcional
- [ ] Domínio customizado configurado
- [ ] Analytics ativado
- [ ] Monitoring configurado
- [ ] Backup dos dados
- [ ] Documentação atualizada

## 🐛 Se algo der errado

### Build Falha
1. Verificar logs no Vercel Dashboard
2. Testar `npm run build` localmente
3. Corrigir erros TypeScript
4. Fazer novo commit e push

### Firebase não conecta
1. Verificar variáveis de ambiente no Vercel
2. Confirmar que começam com `VITE_`
3. Testar credenciais localmente
4. Verificar regras do Firestore

### 404 em rotas
1. Verificar `vercel.json` existe
2. Confirmar rewrites configurados
3. Redeploy se necessário

### Performance ruim
1. Verificar Network tab no DevTools
2. Confirmar code splitting funcionando
3. Checar cache de assets
4. Otimizar imagens se houver

## 📞 Suporte

- 📖 [Documentação Vercel](https://vercel.com/docs)
- 🔥 [Documentação Firebase](https://firebase.google.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Última Verificação:** ___/___/______  
**Deploy Por:** ________________  
**Status:** [ ] ✅ Sucesso  |  [ ] ⚠️ Com avisos  |  [ ] ❌ Falhou
