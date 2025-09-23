# Feed2Dev - Guia de Deploy

Este guia mostra como fazer o deploy completo do sistema Feed2Dev usando Appwrite.

## 🏗️ Estrutura do Projeto

```
feed2dev/
├── admin/          # Painel administrativo (React)
├── widget/         # Widget de feedback (TypeScript)
├── functions/      # Função Appwrite para API
└── backend/        # Scripts de configuração do Appwrite
```

## 📋 Pré-requisitos

1. **Conta Appwrite**: Crie uma conta em [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Node.js**: Versão 18 ou superior
3. **Appwrite CLI**: `npm install -g appwrite-cli`

## 🚀 Deploy Passo a Passo

### 1. Configurar Appwrite

```bash
# 1. Login no Appwrite CLI
appwrite login

# 2. Configurar database e collections
cd backend
node src/setup/appwrite-setup.js
```

### 2. Deploy da Função Appwrite

```bash
# 1. Ir para o diretório de funções
cd functions

# 2. Deploy da função
appwrite deploy function

# 3. Configurar variáveis de ambiente (se necessário)
# No console Appwrite, adicione as variáveis necessárias
```

### 3. Build e Deploy do Widget

```bash
# 1. Ir para o diretório do widget
cd widget

# 2. Instalar dependências
npm install

# 3. Build do widget
npm run build

# 4. Servir o widget (para teste local)
npm run serve
```

### 4. Deploy do Painel Admin

```bash
# 1. Ir para o diretório admin
cd admin

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Build para produção
npm run build

# 5. Deploy (exemplo com Vercel)
npx vercel --prod
```

## 🔧 Configuração das Variáveis

### Admin (.env)
```env
VITE_APPWRITE_PROJECT_ID=68d2f6720002e0a23941
VITE_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
```

### Função Appwrite
As seguintes variáveis são fornecidas automaticamente:
- `APPWRITE_FUNCTION_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID`
- `APPWRITE_API_KEY`

## 📦 Integração do Widget

Adicione este código ao seu site:

```html
<script src="https://seu-dominio.com/widget.js"></script>
<script>
  Feed2Dev.init({
    projectId: 'SEU_PROJECT_ID',
    appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
    appwriteProjectId: '68d2f6720002e0a23941',
    position: 'bottom-right',
    primaryColor: '#667eea',
    title: 'Enviar Feedback',
    subtitle: 'Adoraríamos ouvir sua opinião!'
  });
</script>
```

## 🗄️ Estrutura do Database

### Collections

1. **projects**: Armazena informações dos projetos
   - `name`: Nome do projeto
   - `domain`: Domínio do site
   - `apiKey`: Chave única do projeto
   - `title`: Título do widget
   - `subtitle`: Subtítulo do widget

2. **feedbacks**: Armazena os feedbacks enviados
   - `projectId`: ID do projeto
   - `description`: Descrição do feedback
   - `email`: Email do usuário (opcional)
   - `url`: URL da página
   - `screenshotUrl`: URL do screenshot
   - `status`: Status do feedback (NEW, IN_PROGRESS, RESOLVED, ARCHIVED)

3. **comments**: Comentários administrativos dos feedbacks
   - `feedbackId`: ID do feedback
   - `content`: Conteúdo do comentário
   - `author`: Autor do comentário

### Storage

- **screenshots**: Bucket para armazenar capturas de tela

## 🔐 Permissões

Configure as seguintes permissões no Appwrite:

### Collections
- **projects**: Read/Write para usuários autenticados
- **feedbacks**: Create para anyone, Read/Write para usuários autenticados
- **comments**: Read/Write para usuários autenticados

### Storage
- **screenshots**: Create para anyone, Read para anyone

## 🧪 Teste Local

Para testar localmente:

1. **Widget**:
   ```bash
   cd widget
   npm run serve
   # Acesse http://localhost:3000
   ```

2. **Admin**:
   ```bash
   cd admin
   npm run dev
   # Acesse http://localhost:5173
   ```

3. **Teste Completo**:
   - Abra `test-widget.html` no navegador
   - Teste o envio de feedback
   - Verifique no painel admin

## 📱 Deploy em Produção

### Opções de Hosting

1. **Widget**:
   - Vercel, Netlify, CloudFlare Pages
   - CDN para melhor performance global

2. **Admin**:
   - Vercel, Netlify, Firebase Hosting
   - Qualquer hosting de SPA

3. **Função**:
   - Já está no Appwrite Cloud
   - Escalabilidade automática

## 🔍 Monitoramento

1. **Logs da Função**: Console Appwrite > Functions > Logs
2. **Database**: Console Appwrite > Database > Collections
3. **Storage**: Console Appwrite > Storage > Buckets

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Adicione seu domínio nas configurações do projeto Appwrite
2. **Função não executa**: Verifique logs no console Appwrite
3. **Widget não carrega**: Verifique se o script está acessível publicamente
4. **Admin não conecta**: Verifique variáveis de ambiente

### Debug

1. **Console do navegador**: Para erros no frontend
2. **Logs Appwrite**: Para erros na função e database
3. **Network tab**: Para problemas de conectividade

## 📞 Suporte

Se você encontrar problemas:

1. Verifique os logs no console Appwrite
2. Confirme as configurações de permissão
3. Teste a conectividade da API
4. Verifique se todas as collections foram criadas

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. Configure domínios personalizados
2. Implemente analytics
3. Adicione notificações por email
4. Configure backups automáticos
5. Monitore performance e uso

---

🎊 **Parabéns! Seu sistema Feed2Dev está funcionando!** 🎊