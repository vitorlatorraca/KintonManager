# 🚀 Guia Rápido de Deploy

## Passos Rápidos

### 1. Configure o Banco de Dados

Escolha um serviço gratuito:
- **Neon** (recomendado): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

Copie a **DATABASE_URL** (connection string).

### 2. Execute as Migrações

```bash
# Configure localmente
echo 'DATABASE_URL="sua-connection-string-aqui"' > .env

# Instale dependências
npm install

# Gere Prisma Client
npx prisma generate

# Execute migrações
npm run db:push
```

### 3. Deploy na Vercel

#### Opção A: Via Dashboard (Mais Fácil)

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Importe seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL`: sua connection string
   - `NODE_ENV`: `production`
5. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
# Instale a CLI
npm i -g vercel

# Faça login
vercel login

# Configure variáveis
vercel env add DATABASE_URL
vercel env add NODE_ENV

# Deploy
vercel --prod
```

### 4. Pronto! 🎉

Sua aplicação estará disponível em: `https://seu-projeto.vercel.app`

## ⚠️ Importante

- Certifique-se de que as migrações foram executadas no banco de produção
- A DATABASE_URL deve incluir `?sslmode=require` para Neon
- O primeiro deploy pode levar 3-5 minutos

## 📖 Guia Completo

Para instruções detalhadas, veja o arquivo [DEPLOY.md](./DEPLOY.md)

