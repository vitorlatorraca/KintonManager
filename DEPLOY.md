# 🚀 Guia de Deploy - Kinton Manager

Este guia te ajudará a fazer o deploy da aplicação Kinton Manager na Vercel.

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ Conta no [Vercel](https://vercel.com) (gratuita)
2. ✅ Conta em um serviço de banco de dados PostgreSQL:
   - [Neon](https://neon.tech) (recomendado - gratuito)
   - [Supabase](https://supabase.com) (gratuito)
   - [Railway](https://railway.app) (gratuito)
   - [Render](https://render.com) (gratuito)
3. ✅ Repositório no GitHub (ou GitLab/Bitbucket)

## 🔧 Passo 1: Configurar o Banco de Dados

### Opção A: Neon (Recomendado)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a **Connection String** (DATABASE_URL)
   - Formato: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`
4. Guarde essa URL, você vai precisar dela no próximo passo

### Opção B: Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String** (URI)
5. Guarde essa URL

### Opção C: Railway

1. Acesse [railway.app](https://railway.app) e crie uma conta
2. Crie um novo projeto
3. Adicione um serviço PostgreSQL
4. Copie a **DATABASE_URL** das variáveis de ambiente
5. Guarde essa URL

## 🗄️ Passo 2: Configurar o Schema do Banco de Dados

Após criar o banco de dados, você precisa executar as migrações:

### Opção 1: Via CLI (Local)

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/KintonManager.git
cd KintonManager

# 2. Instale as dependências
npm install

# 3. Configure a variável de ambiente localmente
# Crie um arquivo .env com:
DATABASE_URL="sua-connection-string-aqui"

# 4. Gere o Prisma Client
npx prisma generate

# 5. Execute as migrações do Drizzle
npm run db:push
```

### Opção 2: Via Prisma Studio (Recomendado para iniciantes)

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env
DATABASE_URL="sua-connection-string-aqui"

# 3. Gere o Prisma Client
npx prisma generate

# 4. Abra o Prisma Studio para verificar
npx prisma studio
```

## 🌐 Passo 3: Deploy na Vercel

### Método 1: Via Dashboard (Mais Fácil)

1. **Acesse o Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importe o Projeto**
   - Clique em **"Add New Project"**
   - Selecione o repositório do Kinton Manager
   - Clique em **"Import"**

3. **Configure as Variáveis de Ambiente**
   - Na seção **"Environment Variables"**, adicione:
     - `DATABASE_URL`: Cole a connection string do seu banco de dados
     - `NODE_ENV`: `production`

4. **Configure o Build**
   - **Framework Preset**: Deixe em branco ou selecione "Other"
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

5. **Deploy**
   - Clique em **"Deploy"**
   - Aguarde o build completar (pode levar 2-5 minutos)

### Método 2: Via CLI

```bash
# 1. Instale a CLI do Vercel
npm i -g vercel

# 2. Faça login
vercel login

# 3. No diretório do projeto, execute:
vercel

# 4. Siga as instruções:
# - Link to existing project? No (primeira vez)
# - Project name: kinton-manager (ou o nome que preferir)
# - Directory: ./
# - Override settings? No

# 5. Configure as variáveis de ambiente
vercel env add DATABASE_URL
# Cole a connection string quando solicitado

vercel env add NODE_ENV
# Digite: production

# 6. Faça o deploy
vercel --prod
```

## ✅ Passo 4: Verificar o Deploy

Após o deploy:

1. **Acesse a URL fornecida pela Vercel**
   - Exemplo: `https://kinton-manager.vercel.app`

2. **Teste a Aplicação**
   - Acesse a página inicial
   - Tente fazer login/registro
   - Verifique se o banco de dados está funcionando

3. **Verifique os Logs**
   - No dashboard da Vercel, vá em **"Deployments"**
   - Clique no deployment mais recente
   - Veja os logs para identificar erros

## 🔍 Troubleshooting (Solução de Problemas)

### Erro: "DATABASE_URL must be set"

**Solução**: Verifique se a variável de ambiente `DATABASE_URL` está configurada na Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione `DATABASE_URL` com sua connection string
3. Faça um novo deploy

### Erro: "Cannot connect to database"

**Solução**: 
1. Verifique se a connection string está correta
2. Verifique se o banco de dados permite conexões externas
3. Para Neon: Certifique-se de que o SSL está habilitado (`?sslmode=require`)

### Erro: "Module not found" ou "Build failed"

**Solução**:
1. Verifique se todas as dependências estão no `package.json`
2. Execute `npm install` localmente para verificar
3. Verifique os logs de build na Vercel

### Erro: "Prisma Client not generated"

**Solução**: O script `vercel-build` já inclui `prisma generate`. Se ainda assim der erro:
1. Verifique se o `package.json` tem o script correto:
   ```json
   "vercel-build": "npm run build && prisma generate"
   ```
2. Faça um novo deploy

### Aplicação funciona mas não conecta ao banco

**Solução**:
1. Verifique se as migrações foram executadas
2. Execute localmente: `npm run db:push` com a DATABASE_URL de produção
3. Ou use o Prisma Studio para verificar as tabelas

## 🔄 Atualizações Futuras

Após o primeiro deploy, atualizações são automáticas:

1. **Push para o GitHub**
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push
   ```

2. **Vercel detecta automaticamente**
   - Um novo deploy será iniciado automaticamente
   - Você receberá um email quando completar

## 📝 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Banco de dados criado e acessível
- [ ] Schema do banco de dados aplicado (migrações executadas)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Build completado com sucesso
- [ ] Aplicação acessível na URL fornecida
- [ ] Login/Registro funcionando
- [ ] Conexão com banco de dados funcionando

## 🎉 Pronto!

Sua aplicação está no ar! Compartilhe a URL com seus usuários.

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Verifique os logs do banco de dados
3. Teste localmente com a mesma DATABASE_URL
4. Abra uma issue no GitHub

---

**Dica**: Para desenvolvimento local, use `npm run dev`. Para produção, sempre use o deploy na Vercel.

