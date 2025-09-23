# Feed2Dev - Sistema de Feedback Visual

Um sistema completo de feedback visual similar ao Marker.io, permitindo que usuários enviem feedback com screenshots anotados diretamente dos seus sites.

## 🚀 Funcionalidades

### Widget de Feedback
- **Captura de Screenshot**: Captura automática da tela atual
- **Ferramentas de Anotação**: Desenho, destacar, setas, texto
- **Formulário Intuitivo**: Descrição e email opcional
- **Fácil Integração**: JavaScript vanilla compatível com qualquer site

### Painel Administrativo
- **Dashboard**: Visão geral de projetos e feedbacks
- **Gerenciamento de Projetos**: Criar e configurar projetos
- **Visualização de Feedbacks**: Ver todos os feedbacks por projeto
- **Status de Feedbacks**: Novo, Em Progresso, Resolvido, Arquivado

### API Backend
- **Autenticação JWT**: Sistema seguro de login
- **API RESTful**: Endpoints completos para todas as operações
- **Banco PostgreSQL**: Armazenamento robusto com Prisma ORM

## 📁 Estrutura do Projeto

```
feed2dev/
├── backend/          # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── prisma/
│   │   └── server.ts
│   └── package.json
│
├── widget/           # Widget JavaScript
│   ├── src/
│   │   ├── core/
│   │   ├── ui/
│   │   ├── utils/
│   │   └── index.ts
│   └── dist/         # Build do widget
│
├── admin/            # Painel React + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta no Appwrite Cloud (gratuita)
- npm ou yarn

### 1. Setup Appwrite

1. Acesse [Appwrite Console](https://cloud.appwrite.io)
2. Crie uma API Key com escopo **Server**
3. Anote: Project ID, Endpoint, API Key

### 2. Backend Setup

```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Appwrite

# Criar collections no Appwrite
npm run setup
```

### 3. Admin Panel Setup

```bash
cd admin
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar com Project ID e Endpoint

# Iniciar painel administrativo
npm run dev
```

### 4. Widget Setup

```bash
cd widget
npm install

# Build do widget
npm run build

# Servir localmente para testes (opcional)
npm run serve
```

## 📝 Uso

### 1. Criar um Projeto
1. Acesse o painel admin em `http://localhost:5173`
2. Faça login ou registre-se
3. Crie um novo projeto informando nome e domínio
4. Copie o código de integração fornecido

### 2. Integrar o Widget

Adicione o script no seu site:

```html
<script src="./widget/dist/widget.js"></script>
<script>
  Feed2Dev.init({
    projectId: 'seu-projeto-id', // ID do projeto criado no admin
    appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
    appwriteProjectId: '68d2f6720002e0a23941',
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    primaryColor: '#6366f1', // Cor personalizada (opcional)
    title: 'Enviar Feedback', // Título personalizado (opcional)
    subtitle: 'Adoraríamos ouvir você!' // Subtítulo (opcional)
  });
</script>
```

### 3. Configurações Avançadas

```javascript
Feed2Dev.init({
  projectId: 'seu-projeto-id',
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '68d2f6720002e0a23941',
  position: 'bottom-right',
  primaryColor: '#your-brand-color',
  onSuccess: () => {
    console.log('Feedback enviado com sucesso!');
  },
  onError: (error) => {
    console.error('Erro ao enviar feedback:', error);
  }
});
```

## 🎯 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Obter projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Feedbacks
- `POST /api/feedbacks` - Criar feedback (público)
- `GET /api/feedbacks/project/:id` - Listar feedbacks do projeto
- `GET /api/feedbacks/:id` - Obter feedback
- `PATCH /api/feedbacks/:id/status` - Atualizar status
- `POST /api/feedbacks/:id/comments` - Adicionar comentário

## 🔧 Desenvolvimento

### Backend
```bash
cd backend
npm run dev  # Modo desenvolvimento com hot reload
npm run build  # Build para produção
npm run start  # Iniciar em produção
```

### Widget
```bash
cd widget
npm run dev  # Build com watch mode
npm run build  # Build para produção
```

### Admin
```bash
cd admin
npm run dev  # Servidor de desenvolvimento
npm run build  # Build para produção
```

## 🚀 Deploy

### Backend (Heroku/Railway)
1. Configure variáveis de ambiente
2. Execute migrations: `npm run prisma:migrate`
3. Build: `npm run build`
4. Start: `npm start`

### Admin (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy pasta `dist/`

### Widget (CDN)
1. Build: `npm run build`
2. Upload `widget.js` para CDN
3. Atualize URLs nos projetos

## 🛡️ Segurança

- Autenticação JWT com tokens seguros
- Validação de dados com Zod
- CORS configurado adequadamente
- Sanitização de inputs
- Rate limiting (recomendado para produção)

## 📋 TODO / Melhorias Futuras

- [ ] Sistema de notificações por email
- [ ] Webhooks para integrações
- [ ] Temas personalizáveis do widget
- [ ] Análises e relatórios
- [ ] Exportação de dados
- [ ] API de administração
- [ ] Modo offline do widget
- [ ] Suporte a múltiplos idiomas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.