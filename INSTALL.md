# 🌾 FarmCoin - Guia de Instalação

## ⚡ Instalação Rápida

Execute os seguintes comandos no PowerShell:

```powershell
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em: http://localhost:3000

## 📋 Próximos Passos

Após a instalação, você pode:

1. **Criar uma conta** de usuário
2. **Começar a jogar** FarmCoin
3. **Acessar o painel admin** (se você for admin/moderador/suporte)

## 🔧 Comandos Úteis

### Desenvolvimento
```powershell
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview da build de produção
npm run lint       # Verifica erros de código
```

### Git
```powershell
git add .
git commit -m "sua mensagem"
git push origin main
```

## 🔐 Primeiro Usuário Admin

O primeiro usuário criado será automaticamente um USUÁRIO COMUM (role 3).

Para tornar um usuário ADMIN:
1. Acesse o Firebase Console
2. Vá para Firestore Database
3. Encontre o usuário na coleção `users`
4. Edite o campo `role` para `0`

## 🎨 Personalizações

### Cores do Tema
Edite `tailwind.config.js` para mudar as cores

### Firebase
Edite `src/firebase/config.ts` para suas credenciais

### Upgrades do Jogo
Edite `src/firebase/auth.ts` (array `initialUpgrades`)

## 🆘 Problemas Comuns

### Erro de módulos não encontrados
```powershell
# Delete node_modules e reinstale
Remove-Item -Recurse -Force node_modules
npm install
```

### Porta 3000 ocupada
Edite `vite.config.ts` e mude a porta:
```typescript
server: {
  port: 5173, // ou outra porta
  open: true
}
```

### Erros do Firebase
Verifique se suas credenciais estão corretas em `src/firebase/config.ts`

## 🚀 Pronto para começar!

Execute `npm run dev` e divirta-se! 🎮
