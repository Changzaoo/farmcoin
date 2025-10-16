# 🚀 Deploy no Vercel - FarmCoin

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub
- Firebase configurado (Firestore + Authentication)

---

## ⚡ Deploy Rápido (Recomendado)

### Opção 1: Deploy via Vercel Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório `Changzaoo/farmcoin`
3. Configure as variáveis de ambiente (veja abaixo)
4. Clique em "Deploy"

### Opção 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

---

## 🔐 Variáveis de Ambiente

Configure estas variáveis no **Vercel Dashboard** → **Settings** → **Environment Variables**:

### Firebase Configuration (OBRIGATÓRIO)

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Como obter as variáveis do Firebase:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** (⚙️)
4. Role até **Seus aplicativos** → **SDK setup and configuration**
5. Copie os valores de `firebaseConfig`

---

## 📦 Estrutura de Build

```
farmcoin/
├── dist/                 # Build output (gerado automaticamente)
├── src/                  # Código fonte
│   ├── components/       # Componentes React
│   ├── firebase/         # Configuração Firebase
│   ├── hooks/           # React Hooks customizados
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilitários
│   └── data/            # Dados estáticos (upgrades)
├── public/              # Arquivos estáticos
├── vercel.json          # Configuração Vercel
├── vite.config.ts       # Configuração Vite
└── package.json         # Dependências
```

---

## 🔧 Configurações Otimizadas

### `vercel.json`
- ✅ Framework: Vite
- ✅ Output: `dist/`
- ✅ Rewrites configurados para SPA
- ✅ Headers de segurança
- ✅ Cache otimizado para assets

### `vite.config.ts`
- ✅ Code splitting por vendor
- ✅ Minificação com Terser
- ✅ Source maps desabilitados em produção
- ✅ Chunks otimizados (React, Firebase, UI)

---

## 🧪 Testar Build Localmente

Antes de fazer deploy, teste o build localmente:

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Preview local do build
npm run preview
```

Acesse: http://localhost:4173

---

## 🔥 Configuração do Firebase

### 1. Ativar Firestore

```
Firebase Console → Build → Firestore Database → Create Database
```

**Regras de Segurança Recomendadas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Ranking público (somente leitura)
    match /ranking/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Marketplace público
    match /marketplace/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Terrenos
    match /lands/{landId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Ativar Authentication

```
Firebase Console → Build → Authentication → Get Started
```

Ativar provedores:
- ✅ Email/Password

---

## 🚀 Deploy Automático

O projeto está configurado para **deploy automático** no Vercel:

1. ✅ Push para `master` → Deploy automático
2. ✅ Build passa → Deploy em produção
3. ✅ Build falha → Deploy cancelado

### Comandos Git:

```bash
# Adicionar mudanças
git add .

# Commit
git commit -m "feat: nova funcionalidade"

# Push (dispara deploy)
git push origin master
```

---

## 📊 Monitoramento

### Vercel Dashboard

Acompanhe:
- 📈 Analytics
- 🔍 Logs de build
- ⚡ Performance
- 🌐 Domínios customizados

### Logs de Produção

```bash
vercel logs production
```

---

## 🌐 Domínio Customizado

### Adicionar Domínio:

1. **Vercel Dashboard** → **Settings** → **Domains**
2. Adicionar seu domínio (ex: `farmcoin.com`)
3. Configurar DNS:
   - **CNAME**: `cname.vercel-dns.com`
   - ou **A Record**: `76.76.21.21`

### SSL Automático:
- ✅ Certificado SSL gratuito (Let's Encrypt)
- ✅ Renovação automática
- ✅ HTTPS forçado

---

## 🐛 Troubleshooting

### Build falha com erro TypeScript

```bash
# Verificar erros localmente
npm run build

# Corrigir erros
# ... (corrigir código)

# Testar novamente
npm run build
```

### Variáveis de ambiente não funcionam

- ✅ Certifique-se que começam com `VITE_`
- ✅ Recarregue o deploy após adicionar variáveis
- ✅ Verifique se estão configuradas no Vercel Dashboard

### 404 em rotas

O `vercel.json` já tem rewrites configurados. Se ainda ocorrer:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Firebase Connection Failed

1. Verifique se as variáveis estão corretas
2. Teste localmente com `.env.local`
3. Confirme que Firestore está ativo
4. Verifique regras de segurança do Firestore

---

## 📈 Performance

### Otimizações Aplicadas:

- ✅ **Code Splitting**: Vendors separados (React, Firebase, UI)
- ✅ **Lazy Loading**: Componentes carregados sob demanda
- ✅ **Minificação**: Terser para JavaScript
- ✅ **Cache**: Assets com cache de 1 ano
- ✅ **Compression**: Gzip automático no Vercel

### Lighthouse Score Esperado:

- 🟢 Performance: 90+
- 🟢 Accessibility: 95+
- 🟢 Best Practices: 95+
- 🟢 SEO: 90+

---

## 🔄 CI/CD Pipeline

### Workflow Automático:

1. **Push** → GitHub
2. **Webhook** → Vercel
3. **Install** → `npm install`
4. **Build** → `npm run build`
5. **Deploy** → Production
6. **Notify** → Email/Slack (opcional)

### Preview Deployments:

- ✅ Todo PR gera preview deploy
- ✅ URL única para testes
- ✅ Comentário automático no PR

---

## 📝 Checklist de Deploy

Antes de fazer deploy final:

- [ ] ✅ Todas as variáveis de ambiente configuradas
- [ ] ✅ Firebase Firestore ativo
- [ ] ✅ Firebase Authentication ativo
- [ ] ✅ Build local passa sem erros
- [ ] ✅ Preview local funciona (`npm run preview`)
- [ ] ✅ `.env.example` atualizado com variáveis necessárias
- [ ] ✅ README.md atualizado
- [ ] ✅ Testes realizados (se houver)

---

## 🎯 Links Úteis

- 📖 [Documentação Vercel](https://vercel.com/docs)
- 🔥 [Firebase Console](https://console.firebase.google.com)
- ⚡ [Vite Docs](https://vitejs.dev)
- 🚀 [Vercel CLI](https://vercel.com/docs/cli)

---

## 💡 Dicas

1. **Use Preview Deployments** para testar antes de produção
2. **Configure Analytics** no Vercel para monitorar tráfego
3. **Ative Notifications** para ser alertado sobre deploys
4. **Use Environment Variables** diferentes para dev/prod
5. **Configure Custom Domain** para profissionalizar

---

## 🆘 Suporte

Problemas com deploy?

1. Verifique [Vercel Status](https://www.vercel-status.com/)
2. Consulte [Vercel Discussions](https://github.com/vercel/vercel/discussions)
3. Abra issue no repositório

---

**Última Atualização:** Outubro 2025  
**Versão:** 2.0  
**Status:** ✅ Pronto para produção
