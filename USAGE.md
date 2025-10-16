# 🎮 FarmCoin - Guia Completo de Uso

## 📚 Índice

1. [Começando](#começando)
2. [Sistema de Autenticação](#sistema-de-autenticação)
3. [Jogando FarmCoin](#jogando-farmcoin)
4. [Sistema de Permissões](#sistema-de-permissões)
5. [Painel Administrativo](#painel-administrativo)
6. [Sistema de Logs](#sistema-de-logs)
7. [Firestore Structure](#firestore-structure)
8. [Security Rules](#security-rules)

---

## 🚀 Começando

### Instalação

```powershell
# Clone o repositório
git clone https://github.com/Changzaoo/farmcoin.git
cd farmcoin

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🔐 Sistema de Autenticação

### Registro de Usuário

1. Clique em **"Criar conta"**
2. Preencha:
   - Nome de usuário
   - Email
   - Senha (mínimo 6 caracteres)
   - Confirmar senha

#### O que acontece nos bastidores:

```typescript
// 1. Gera um salt aleatório de 32 caracteres
const salt = generateSalt(32);

// 2. Combina senha + salt
const saltedPassword = password + salt;

// 3. Cria hash SHA-512
const hash = await crypto.subtle.digest('SHA-512', saltedPassword);

// 4. Armazena: salt$hash
const passwordHash = `${salt}$${hash}`;
```

### Login

1. Digite email e senha
2. Sistema verifica o hash
3. Atualiza `lastLogin`
4. Carrega dados do jogo

---

## 🎮 Jogando FarmCoin

### Interface Principal

```
┌─────────────────────────────────────────┐
│  🌾 FarmCoin    🪙 1,234.5   [🎁 Comprar]│
├─────────────────────────────────────────┤
│                                         │
│         Renda: +45.3/s                  │
│         Total: 🪙 10,456                │
│         Items: 123                      │
│                                         │
│     [👨‍🌾 CLICAR (+0.1)]                 │
│                                         │
├─────────────────────────────────────────┤
│  📍 Meu Império                         │
│  🌱×5  🐄×3  🚜×2  ...                  │
├─────────────────────────────────────────┤
│  🛒 Loja do Império                     │
│                                         │
│  🌱 Plantações (12) [▼]                │
│    🌱 Semente - 🪙3 (+0.03/s)          │
│    🌾 Trigo - 🪙5 (+0.05/s)            │
│    ...                                  │
│                                         │
│  🐄 Animais (13) [▶]                   │
│  🔧 Ferramentas (11) [▶]               │
│  ...                                    │
└─────────────────────────────────────────┘
```

### Mecânicas do Jogo

#### 1. Cliques Manuais
- Cada clique = **+0.1 moedas**
- Registrado em logs ocasionalmente

#### 2. Upgrades
- **Compre** itens para aumentar renda passiva
- **Custo aumenta** 15% a cada compra
- **Renda** é acumulada por segundo

#### 3. Renda Passiva
- Calculada automaticamente
- Baseada em todos os upgrades comprados
- `Total Income = Σ(upgrade.income × upgrade.count)`

#### 4. Pacotes de Moedas (Loja)
- 🪙 100 + 0 bônus = $0.99
- 🪙 500 + 50 bônus = $3.99
- 🪙 1,500 + 300 bônus = $9.99
- 🪙 5,000 + 1,500 bônus = $29.99

### Categorias de Upgrades

| Categoria | Itens | Ícone | Descrição |
|-----------|-------|-------|-----------|
| Plantações | 12 | 🌱 | Sementes, frutas, vegetais |
| Animais | 13 | 🐄 | Galinhas, vacas, cavalos |
| Ferramentas | 11 | 🔧 | Enxadas, tratores, colheitadeiras |
| Estruturas | 11 | 🏗️ | Celeiros, silos, estábulos |
| Decorações | 10 | 🎨 | Árvores, flores, fontes |
| Cientistas | 10 | 👨‍🔬 | Especialistas, professores |
| Tecnologia | 11 | 🚀 | Computadores, drones, satélites |
| Veículos | 10 | 🚗 | Carros, aviões, navios |
| Alimentos | 12 | 🍕 | Pizza, sushi, hambúrgueres |
| Natureza | 11 | 🌍 | Montanhas, vulcões, oceanos |

---

## 👥 Sistema de Permissões

### Níveis de Acesso

```typescript
enum UserRole {
  ADMIN = 0,      // 🔴 Acesso Total
  MODERATOR = 1,  // 🟡 Visualizar + Moderar
  SUPPORT = 2,    // 🟢 Visualizar + Suporte
  USER = 3        // 🔵 Apenas Jogar
}
```

### Matriz de Permissões

| Ação | Admin | Moderador | Suporte | Usuário |
|------|-------|-----------|---------|---------|
| Jogar | ✅ | ✅ | ✅ | ✅ |
| Ver próprios logs | ✅ | ✅ | ✅ | ✅ |
| Ver logs de outros | ✅ | ✅ | ✅ | ❌ |
| Ver lista de usuários | ✅ | ✅ | ✅ | ❌ |
| Ver estatísticas | ✅ | ✅ | ✅ | ❌ |
| Mudar role de usuário | ✅ | ❌ | ❌ | ❌ |
| Banir usuário | ✅ | ✅ | ❌ | ❌ |
| Acesso ao painel admin | ✅ | ✅ | ✅ | ❌ |

### Como Promover um Usuário

#### Método 1: Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Firestore Database**
4. Navegue até `users` → `[userId]`
5. Edite o campo `role`:
   - `0` = Admin
   - `1` = Moderador
   - `2` = Suporte
   - `3` = Usuário

#### Método 2: Código (Admin apenas)

```typescript
import { updateUserRole } from './firebase/firestore';

// No painel admin
await updateUserRole(userId, UserRole.MODERATOR);
```

---

## 📊 Painel Administrativo

Acesse: `/admin` (apenas roles 0, 1, 2)

### Funcionalidades

#### 1. Lista de Usuários

```
┌──────────────────────────────────────────────────┐
│  👥 Usuários Cadastrados                         │
├──────────────────────────────────────────────────┤
│  🔍 Buscar usuário...                            │
├──────────────────────────────────────────────────┤
│  📋 João Silva                                   │
│     📧 joao@email.com                           │
│     🎖️ Role: User (3)                           │
│     🪙 1,234 moedas                             │
│     📅 Criado: 15/10/2025                       │
│     🕐 Último login: Há 2 horas                 │
│     [Ver Detalhes] [Ver Logs]                   │
├──────────────────────────────────────────────────┤
│  📋 Maria Santos                                 │
│     ...                                          │
└──────────────────────────────────────────────────┘
```

#### 2. Detalhes do Usuário

```
┌──────────────────────────────────────────────────┐
│  📋 Detalhes de João Silva                       │
├──────────────────────────────────────────────────┤
│  📊 Estatísticas                                 │
│     🪙 Moedas: 1,234.5                          │
│     💰 Total ganho: 10,456                      │
│     📈 Renda/seg: +45.3                         │
│     🖱️ Cliques: 1,523                           │
│     🛒 Compras: 89                              │
│                                                  │
│  📦 Inventário (Top 10)                         │
│     🌱 Semente ×15                              │
│     🐄 Vaca ×8                                  │
│     🚜 Trator ×3                                │
│     ...                                          │
│                                                  │
│  📜 Logs Recentes (últimos 20)                  │
│     [Ver todos os logs]                         │
└──────────────────────────────────────────────────┘
```

#### 3. Visualizador de Logs

```
┌──────────────────────────────────────────────────┐
│  📜 Logs de João Silva                           │
├──────────────────────────────────────────────────┤
│  🔍 Filtros                                      │
│     Tipo: [Todos ▼]                             │
│     Data: [Últimos 7 dias ▼]                    │
├──────────────────────────────────────────────────┤
│  ⏰ 16/10/2025 14:32:15                         │
│  🛒 PURCHASE_UPGRADE                            │
│  Comprou Trator                                  │
│  💰 -1,200 → Saldo: 234.5                      │
│  📊 Count: 3 | Novo custo: 1,380               │
│                                                  │
│  ⏰ 16/10/2025 14:31:08                         │
│  📈 PASSIVE_INCOME                              │
│  Ganhou 45.3 moedas (renda passiva 1min)       │
│  💰 +45.3 → Saldo: 1,434.5                     │
│                                                  │
│  ⏰ 16/10/2025 14:30:42                         │
│  🖱️ CLICK                                       │
│  Clique manual                                   │
│  💰 +0.1 → Saldo: 1,389.2                      │
└──────────────────────────────────────────────────┘
```

---

## 📝 Sistema de Logs

### Tipos de Log

```typescript
enum LogType {
  CLICK = 'click',                    // 🖱️ Clique manual
  PURCHASE_UPGRADE = 'purchase_upgrade', // 🛒 Compra de upgrade
  PURCHASE_COINS = 'purchase_coins',     // 🎁 Compra de moedas
  PASSIVE_INCOME = 'passive_income',     // 📈 Renda passiva
  LOGIN = 'login',                       // 🔐 Login
  REGISTER = 'register'                  // ✍️ Registro
}
```

### Estrutura do Log

```typescript
interface UserLog {
  id: string;
  userId: string;
  type: LogType;
  amount: number;
  description: string;
  metadata: {
    upgradeId?: string;
    upgradeName?: string;
    upgradeCount?: number;
    packageId?: string;
    balanceBefore?: number;
    balanceAfter?: number;
    // ... outros campos dinâmicos
  };
  timestamp: Date;
}
```

### Exemplo de Log Completo

```json
{
  "id": "abc123def456",
  "userId": "user_xyz789",
  "type": "purchase_upgrade",
  "amount": -1200,
  "description": "Comprou Trator",
  "metadata": {
    "upgradeId": "trator",
    "upgradeName": "Trator",
    "upgradeCount": 3,
    "upgradeCost": 1200,
    "newCost": 1380,
    "balanceBefore": 1434.5,
    "balanceAfter": 234.5
  },
  "timestamp": "2025-10-16T14:32:15.123Z"
}
```

### Auditoria Completa

O sistema registra **TUDO**:

- ✅ Cada compra de upgrade
- ✅ Valores antes e depois
- ✅ Novos custos calculados
- ✅ Renda passiva (a cada minuto)
- ✅ Alguns cliques (amostragem)
- ✅ Compras de moedas
- ✅ Logins e registros

---

## 🗄️ Firestore Structure

### Coleção: `users`

```
users/
  ├─ {userId}/
  │   ├─ uid: string
  │   ├─ email: string
  │   ├─ username: string
  │   ├─ role: number (0-3)
  │   ├─ passwordHash: string (salt$hash)
  │   ├─ createdAt: timestamp
  │   ├─ lastLogin: timestamp
  │   ├─ lastUpdated: timestamp
  │   ├─ gameState: {
  │   │    coins: number
  │   │    totalCoins: number
  │   │    perSecond: number
  │   │    totalClicks: number
  │   │    totalPurchases: number
  │   │  }
  │   └─ upgrades: [{
  │        id: string
  │        name: string
  │        cost: number
  │        income: number
  │        count: number
  │        icon: string
  │        category: string
  │      }, ...]
```

### Coleção: `logs`

```
logs/
  ├─ {logId}/
  │   ├─ userId: string
  │   ├─ type: string
  │   ├─ amount: number
  │   ├─ description: string
  │   ├─ metadata: object
  │   └─ timestamp: timestamp
```

---

## 🔒 Security Rules

Configure estas regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return isSignedIn() && getUserData().role == 0;
    }
    
    function isModerator() {
      return isSignedIn() && getUserData().role == 1;
    }
    
    function isSupport() {
      return isSignedIn() && getUserData().role == 2;
    }
    
    function canViewAllUsers() {
      return isAdmin() || isModerator() || isSupport();
    }
    
    // Users collection
    match /users/{userId} {
      // Qualquer um pode criar (registro)
      allow create: if isSignedIn();
      
      // Usuário pode ler próprios dados
      // Admin/Moderador/Suporte podem ler todos
      allow read: if isOwner(userId) || canViewAllUsers();
      
      // Usuário pode atualizar próprios dados (exceto role)
      // Admin pode atualizar qualquer coisa
      allow update: if (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) 
                    || isAdmin();
      
      // Apenas admin pode deletar
      allow delete: if isAdmin();
    }
    
    // Logs collection
    match /logs/{logId} {
      // Qualquer usuário autenticado pode criar logs
      allow create: if isSignedIn();
      
      // Usuário pode ler próprios logs
      // Admin/Moderador/Suporte podem ler todos
      allow read: if (isSignedIn() && resource.data.userId == request.auth.uid) 
                  || canViewAllUsers();
      
      // Ninguém pode atualizar logs
      allow update: if false;
      
      // Apenas admin pode deletar logs
      allow delete: if isAdmin();
    }
  }
}
```

---

## 🚀 Deploy

### Firebase Hosting

```powershell
# Build
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init
firebase init hosting

# Deploy
firebase deploy
```

---

## 🆘 Suporte

- 📧 Email: suporte@farmcoin.com
- 🐛 Issues: https://github.com/Changzaoo/farmcoin/issues
- 📖 Docs: https://github.com/Changzaoo/farmcoin/wiki

---

**Divirta-se jogando FarmCoin! 🌾🎮**
