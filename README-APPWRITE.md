# Feed2Dev com Appwrite - Guia de Configuração

Sistema de feedback visual totalmente integrado com Appwrite como backend-as-a-service.

## 🚀 Configuração do Appwrite

### 1. Configurar Projeto no Appwrite Console

1. Acesse [Appwrite Console](https://cloud.appwrite.io)
2. Crie um novo projeto ou use o existente (ID: `68d2f6720002e0a23941`)
3. Anote o **Project ID** e **Endpoint**
4. Gere uma **API Key** com permissões administrativas

### 2. Configurar Backend

```bash
cd backend

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas credenciais
APPWRITE_PROJECT_ID=68d2f6720002e0a23941
APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
APPWRITE_API_KEY=sua-api-key-aqui
```

### 3. Executar Setup do Appwrite

```bash
cd backend
npm install
npm run setup
```

Este comando irá criar:
- ✅ Database `feed2dev-main`
- ✅ Collection `projects` (projetos)
- ✅ Collection `feedbacks` (feedbacks)
- ✅ Collection `comments` (comentários)
- ✅ Storage bucket `screenshots` (imagens)

### 4. Configurar Admin Panel

```bash
cd admin

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env
VITE_APPWRITE_PROJECT_ID=68d2f6720002e0a23941
VITE_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1

# Instalar dependências e iniciar
npm install
npm run dev
```

### 5. Configurar Widget

```bash
cd widget
npm install
npm run build
```

## 🎯 Integração do Widget (Atualizada)

### Configuração Básica

```html
<script src="./widget/dist/widget.js"></script>
<script>
  Feed2Dev.init({
    projectId: 'seu-projeto-id', // ID do projeto criado no admin
    appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
    appwriteProjectId: '68d2f6720002e0a23941'
  });
</script>
```

### Configuração Avançada

```javascript
Feed2Dev.init({
  projectId: 'seu-projeto-id',
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '68d2f6720002e0a23941',
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  primaryColor: '#6366f1',
  title: 'Enviar Feedback',
  subtitle: 'Adoraríamos ouvir você!',
  onSuccess: () => {
    console.log('Feedback enviado!');
  },
  onError: (error) => {
    console.error('Erro:', error);
  }
});
```

## 🔧 Funcionalidades com Appwrite

### ✅ Autenticação
- Login/Register usando Appwrite Auth
- Sessões gerenciadas automaticamente
- Logout seguro

### ✅ Banco de Dados
- Projetos armazenados no Appwrite Database
- Feedbacks com relacionamentos
- Comentários aninhados
- Queries otimizadas com indexes

### ✅ Storage
- Screenshots enviados para Appwrite Storage
- URLs publicas automáticas
- Compressão e otimização

### ✅ Permissões
- Read/Write baseado em usuário
- Feedbacks públicos (create only)
- Administração restrita por usuário

## 🏗️ Estrutura do Banco de Dados

### Collection: `projects`
```json
{
  "name": "string",
  "domain": "string", 
  "description": "string",
  "apiKey": "string",
  "userId": "string"
}
```

### Collection: `feedbacks`
```json
{
  "projectId": "string",
  "description": "string",
  "screenshot": "string|null",
  "email": "string",
  "userAgent": "string",
  "url": "string", 
  "status": "enum[NEW,IN_PROGRESS,RESOLVED,ARCHIVED]",
  "metadata": "string"
}
```

### Collection: `comments`
```json
{
  "feedbackId": "string",
  "text": "string",
  "author": "string"
}
```

## 🚀 Deploy

### 1. Appwrite Cloud (Recomendado)
- Use o Appwrite Cloud já configurado
- Sem necessidade de servidor próprio
- Escalabilidade automática

### 2. Admin Panel
```bash
cd admin
npm run build
# Deploy pasta dist/ no Vercel/Netlify
```

### 3. Widget
```bash
cd widget  
npm run build
# Upload widget.js para CDN
```

## 🔐 Segurança

### Permissões Configuradas:
- **Projects**: Apenas owner pode ler/editar
- **Feedbacks**: Qualquer um pode criar, apenas owner pode ler/editar
- **Comments**: Apenas owner pode criar/ler
- **Storage**: Leitura pública, escrita para qualquer um

### Validação:
- Dados validados com Zod
- Upload de arquivos restrito a imagens
- Rate limiting no Appwrite

## 📊 Monitoramento

### Appwrite Console:
- Analytics de uso
- Logs de requisições
- Métricas de storage
- Status de saúde

### Admin Dashboard:
- Estatísticas de projetos
- Feedbacks por status
- Comentários recentes

## 🛠️ Desenvolvimento

### Variáveis de Ambiente

**Backend (.env):**
```env
APPWRITE_PROJECT_ID=68d2f6720002e0a23941
APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
APPWRITE_API_KEY=sua-api-key
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
WIDGET_URL=http://localhost:3000
```

**Admin (.env):**
```env
VITE_APPWRITE_PROJECT_ID=68d2f6720002e0a23941
VITE_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
```

### Comandos Úteis

```bash
# Backend setup
cd backend && npm run setup

# Desenvolvimento
npm run dev  # Backend + Admin em paralelo

# Build para produção
npm run build  # Todos os componentes
```

## 🆘 Troubleshooting

### Erro de Permissões
- Verifique se a API Key tem permissões administrativas
- Confira se as collections foram criadas corretamente

### Upload de Screenshots
- Verifique se o bucket `screenshots` existe
- Confirme permissões de escrita pública

### Autenticação
- Certifique-se de que as sessões estão habilitadas
- Verifique CORS no console do Appwrite

## 📝 Migration Notes

### Do Backend Express para Appwrite:
- ❌ Removido: Prisma, PostgreSQL, JWT
- ✅ Adicionado: Appwrite SDK, Collections, Auth
- 🔄 Mantido: Estrutura de dados similar

### Vantagens da Migração:
- 🚀 Setup mais rápido
- 🔐 Autenticação built-in
- 📊 Analytics integrado  
- 🌐 CDN global
- 💰 Pricing flexível