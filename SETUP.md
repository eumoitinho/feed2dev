# 🚀 Feed2Dev - Setup Rápido

## 1. Configurar Appwrite

### Criar API Key
1. Acesse [Appwrite Console](https://cloud.appwrite.io)
2. Vá em **Settings** → **API Keys**
3. Crie uma nova API Key com escopo **Server**
4. Copie a API Key gerada

## 2. Setup Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais:
# APPWRITE_PROJECT_ID=68d2f6720002e0a23941
# APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
# APPWRITE_API_KEY=sua-api-key-aqui

# Executar setup do Appwrite (criar collections)
npm run setup
```

## 3. Setup Admin Panel

```bash
cd admin

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar painel administrativo
npm run dev
```

## 4. Setup Widget

```bash
cd widget

# Instalar dependências
npm install

# Build do widget
npm run build
```

## 5. Testar Sistema

1. **Admin Panel**: http://localhost:5173
   - Registre uma conta
   - Crie um projeto
   - Copie o código de integração

2. **Widget**: Teste em uma página HTML
   ```html
   <script src="./widget/dist/widget.js"></script>
   <script>
     Feed2Dev.init({
       projectId: 'SEU_PROJECT_ID'
     });
   </script>
   ```

## ✅ Verificações

- [ ] Appwrite Console acessível
- [ ] API Key configurada 
- [ ] Collections criadas (`npm run setup`)
- [ ] Admin Panel funcionando
- [ ] Widget buildado
- [ ] Projeto criado no admin
- [ ] Feedback enviado via widget

## 🔧 Problemas Comuns

### Setup falha
- Verifique se a API Key tem permissões de Server
- Confirme se PROJECT_ID e ENDPOINT estão corretos

### Widget não aparece
- Verifique se o build foi executado
- Confirme se o PROJECT_ID está correto
- Abra DevTools para ver erros

### Login não funciona
- Verifique se as collections foram criadas
- Confirme configurações do Appwrite no admin

## 📚 Próximos Passos

- Personalizar cores e posição do widget
- Configurar notificações por email
- Deploy em produção