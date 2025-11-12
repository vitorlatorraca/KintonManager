# 🐛 Debug do Erro no Vercel - Guia Passo a Passo

## 📋 Informações do Projeto

- **Tipo**: Vite + Express (não é Next.js)
- **API Handler**: `/api/index.ts`
- **Variáveis de Ambiente Necessárias**: `DATABASE_URL`, `NODE_ENV`

## 🔍 Passo 1: Verificar Variáveis de Ambiente no Vercel

### No Dashboard do Vercel:

1. Acesse: **Settings** → **Environment Variables**
2. Verifique se estas variáveis estão configuradas:

```
DATABASE_URL = sua-connection-string-postgresql
NODE_ENV = production (opcional, mas recomendado)
```

### ⚠️ Erros Comuns:

- ❌ Variável `DATABASE_URL` não configurada
- ❌ Variável configurada apenas para Preview, não para Production
- ❌ Connection string incorreta ou sem `?sslmode=require` (para Neon)
- ❌ Espaços extras ou caracteres especiais na connection string

### ✅ Como Configurar Corretamente:

1. Clique em **"Add New"**
2. **Key**: `DATABASE_URL`
3. **Value**: Cole a connection string completa
   - Exemplo Neon: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
4. **Environment**: Selecione **Production**, **Preview** e **Development** (ou pelo menos Production)
5. Clique em **Save**

## 🔍 Passo 2: Verificar os Logs

### No Dashboard do Vercel:

1. Vá em **Deployments** → Clique no deployment mais recente
2. Clique em **Runtime Logs** (não Build Logs)
3. Procure por erros como:

```
DATABASE_URL must be set
Cannot connect to database
Module not found
ReferenceError: ...
TypeError: ...
```

### 📸 O que Procurar nos Logs:

- **Erro de conexão com banco**: `DATABASE_URL` faltando ou incorreta
- **Erro de módulo**: Dependência não instalada ou import incorreto
- **Erro de inicialização**: Problema no código de setup

## 🔍 Passo 3: Testar Localmente

### Teste o Build:

```bash
# 1. Configure a variável de ambiente localmente
# Windows PowerShell:
$env:DATABASE_URL="sua-connection-string-aqui"
$env:NODE_ENV="production"

# Windows CMD:
set DATABASE_URL=sua-connection-string-aqui
set NODE_ENV=production

# Linux/Mac:
export DATABASE_URL="sua-connection-string-aqui"
export NODE_ENV="production"

# 2. Instale dependências (se ainda não fez)
npm install

# 3. Gere Prisma Client
npx prisma generate

# 4. Faça o build
npm run build

# 5. Teste o servidor
npm start
```

### Se funcionar localmente mas não no Vercel:

✅ **99% de chance de ser variável de ambiente faltando ou incorreta**

### Se não funcionar nem localmente:

❌ **Problema no código** - veja os erros no terminal

## 🔍 Passo 4: Rota de Teste Simples

Adicionei uma rota de teste em `/api/test` para verificar se o serverless está funcionando.

### Como Testar:

1. Faça o deploy
2. Acesse: `https://seu-projeto.vercel.app/api/test`
3. Deve retornar: `{"status": "ok", "message": "API is working"}`

### Se a rota de teste funcionar:

✅ O serverless está OK, o problema está em outra rota (provavelmente relacionado ao banco de dados)

### Se a rota de teste não funcionar:

❌ Problema na configuração do serverless ou no handler principal

## 🔍 Passo 5: Checklist de Verificação

Antes de fazer um novo deploy, verifique:

- [ ] `DATABASE_URL` está configurada no Vercel (Settings → Environment Variables)
- [ ] `DATABASE_URL` está configurada para **Production** (não só Preview)
- [ ] Connection string está correta e completa
- [ ] Build local funciona (`npm run build`)
- [ ] Servidor local funciona (`npm start`)
- [ ] Migrações do banco foram executadas (`npm run db:push`)

## 🚀 Próximos Passos

1. **Verifique as variáveis de ambiente no Vercel** (Passo 1)
2. **Veja os Runtime Logs** (Passo 2) e me envie o erro específico
3. **Teste localmente** (Passo 3) para isolar o problema
4. **Teste a rota `/api/test`** (Passo 4) após o deploy

## 📞 Me Envie:

Se ainda não funcionar, me envie:

1. **Screenshot ou texto dos Runtime Logs** (erro específico)
2. **Se o build local funciona** (sim/não)
3. **Se a rota `/api/test` funciona** (sim/não)
4. **Screenshot das Environment Variables no Vercel** (sem mostrar valores sensíveis, só os nomes)

Com essas informações, consigo te ajudar a resolver linha por linha! 🎯

