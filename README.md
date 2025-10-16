# 🌾 FarmCoin - Jogo Idle de Fazenda

## 🚀 Sobre o Projeto

FarmCoin é um jogo idle de fazenda com sistema completo de autenticação, criptografia SHA-512, Firebase Firestore e sistema de permissões multinível.

## ✨ Características

- 🔐 **Autenticação Segura** com SHA-512
- 🎮 **Jogo Idle** com mais de 100 upgrades
- 📊 **Sistema de Logs Detalhado** - rastreia cada ação do usuário
- 👥 **Sistema de Permissões**:
  - **Nível 0**: Administrador (acesso total)
  - **Nível 1**: Moderador (visualizar usuários e logs)
  - **Nível 2**: Suporte (visualizar usuários e logs)
  - **Nível 3**: Usuário comum (apenas jogar)
- 🎨 **Interface Moderna** com Tailwind CSS
- ☁️ **Firebase Backend** para armazenamento em nuvem
- 📈 **Painel Administrativo** para gerenciar usuários

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Firebase** (Auth, Firestore, Analytics)
- **Tailwind CSS** para estilização
- **Vite** como bundler
- **Lucide React** para ícones
- **React Router** para navegação

## 📦 Instalação

### 1. Clone o repositório

```powershell
git clone https://github.com/Changzaoo/farmcoin.git
cd farmcoin
```

### 2. Instale as dependências

```powershell
npm install
```

### 3. Configure o Firebase

O Firebase já está configurado no projeto, mas você pode modificar as credenciais em:
`src/firebase/config.ts`

### 4. Inicie o servidor de desenvolvimento

```powershell
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🎮 Como Jogar

1. **Crie uma conta** ou faça login
2. **Clique** no botão para ganhar moedas
3. **Compre upgrades** para aumentar sua renda passiva
4. **Construa seu império** agrícola!

## 🔑 Sistema de Autenticação

### Criptografia SHA-512

Todas as senhas são criptografadas usando SHA-512 com salt aleatório:

- **Salt único** para cada usuário
- **Hash de 128 caracteres** hexadecimais
- **Impossível reverter** para a senha original

### Formato de Armazenamento

```
salt$hash
```

Exemplo:
```
a3f2c1...b4e5$9d8e7f6a...1c2b3a
```

## 📊 Sistema de Logs

Toda ação do usuário é registrada no Firestore:

### Tipos de Log

- **CLICK**: Cliques manuais
- **PURCHASE_UPGRADE**: Compra de upgrades
- **PURCHASE_COINS**: Compra de moedas
- **PASSIVE_INCOME**: Renda passiva
- **LOGIN**: Login do usuário
- **REGISTER**: Registro do usuário

### Estrutura do Log

```typescript
{
  id: string;
  userId: string;
  type: LogType;
  amount: number;
  description: string;
  metadata: {
    upgradeId?: string;
    upgradeName?: string;
    balanceBefore?: number;
    balanceAfter?: number;
    // ... outros campos
  };
  timestamp: Date;
}
```

## 👥 Sistema de Permissões

### UserRole Enum

```typescript
enum UserRole {
  ADMIN = 0,      // Acesso total
  MODERATOR = 1,  // Visualizar usuários e logs
  SUPPORT = 2,    // Visualizar usuários e logs
  USER = 3        // Apenas jogar
}
```

### Painel de Administração

Acessível em `/admin` (apenas para roles 0, 1, e 2):

- 📋 **Lista de todos os usuários**
- 📊 **Estatísticas detalhadas**
- 📜 **Histórico de ações**
- 🔍 **Visualização de logs por usuário**
- 📈 **Gráficos de progresso**

## 🗄️ Estrutura do Firestore

### Coleção `users`

```typescript
{
  uid: string;
  email: string;
  username: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  gameState: {
    coins: number;
    totalCoins: number;
    perSecond: number;
    totalClicks: number;
    totalPurchases: number;
  };
  upgrades: Upgrade[];
}
```

### Coleção `logs`

```typescript
{
  userId: string;
  type: LogType;
  amount: number;
  description: string;
  metadata: object;
  timestamp: Timestamp;
}
```

## 🎨 Upgrades Disponíveis

### Categorias

- 🌱 **Plantações** (12 itens)
- 🐄 **Animais** (13 itens)
- 🔧 **Ferramentas** (11 itens)
- 🏗️ **Estruturas** (11 itens)
- 🎨 **Decorações** (10 itens)
- 👨‍🔬 **Cientistas** (10 itens)
- 🚀 **Tecnologia** (11 itens)
- 🚗 **Veículos** (10 itens)
- 🍕 **Alimentos** (12 itens)
- 🌍 **Natureza** (11 itens)

**Total**: +100 upgrades únicos!

## 🔒 Segurança

- ✅ Criptografia SHA-512 para senhas
- ✅ Salt único por usuário
- ✅ Firebase Authentication
- ✅ Firestore Security Rules (configure no Firebase Console)
- ✅ Validação de permissões no frontend e backend

## 📝 Scripts Disponíveis

```powershell
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🚀 Deploy

### Firebase Hosting

```powershell
# Build do projeto
npm run build

# Instale Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicialize o projeto
firebase init hosting

# Deploy
firebase deploy
```

### Outras Opções

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade de desenvolvedores.

## 📞 Suporte

Se você tiver alguma dúvida ou problema:

1. Abra uma **Issue** no GitHub
2. Entre em contato através do email do projeto

---

**Divirta-se construindo seu império agrícola! 🌾🚜**
