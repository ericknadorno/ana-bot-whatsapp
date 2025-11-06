# 👋 Comece Aqui - Ana Bot

**🔗 GitHub**: https://github.com/ericknadorno/ana-bot-whatsapp

## ⚡ 3 Passos para Usar a Ana

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/ericknadorno/ana-bot-whatsapp.git
cd ana-bot-whatsapp
npm install
```

### 2️⃣ Configure

```bash
# Copie o exemplo
cp .env.example .env

# Edite com seus dados
nano .env  # ou use seu editor preferido
```

**Mínimo necessário no `.env`:**
```env
TZ=Europe/Lisbon
OWNER_NUMBER=3519xxxxxxxx@c.us
```

### 3️⃣ Execute

```bash
npm run build
npm start
```

✅ **Pronto!** Escaneie o QR Code e envie "ajuda" no WhatsApp.

---

## 🎯 Ou Use o Replit (Sem Instalar Nada)

1. Acesse: https://replit.com
2. Import from GitHub: `https://github.com/ericknadorno/ana-bot-whatsapp`
3. Configure Secrets (🔒):
   - `TZ=Europe/Lisbon`
   - `OWNER_NUMBER=3519xxxxxxxx@c.us`
4. Clique em "Run"
5. Escaneie o QR Code

**Guia completo**: [REPLIT_GUIDE.md](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md)

---

## 📖 Documentação

| Documento | Quando Usar |
|-----------|-------------|
| [**QUICK_START.md**](computer:///mnt/user-data/outputs/ana-bot/QUICK_START.md) | Quer começar rápido |
| [**REPLIT_GUIDE.md**](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md) | Deploy no Replit |
| [**README.md**](computer:///mnt/user-data/outputs/ana-bot/README.md) | Documentação completa |
| [**ARCHITECTURE.md**](computer:///mnt/user-data/outputs/ana-bot/ARCHITECTURE.md) | Entender o código |

---

## 💬 Primeiros Comandos

Após conectar, teste estes comandos no WhatsApp:

```
ajuda
add tarefa testar a Ana
minhas tarefas
reunião amanhã às 10h: teste
despesa 10 teste
```

---

## ❓ Como Obter o OWNER_NUMBER?

**Seu WhatsApp**: +351 912 345 678
**Formato correto**: `351912345678@c.us`

**Regra**: [código país][número sem espaços]@c.us

---

## 🐛 Problemas?

**QR Code não aparece?**
→ Aguarde 1 minuto ou reinicie

**Bot não responde?**
→ Verifique se `OWNER_NUMBER` está correto

**Mais ajuda**: [README.md - Troubleshooting](computer:///mnt/user-data/outputs/ana-bot/README.md)

---

## 📦 Arquivos do Projeto

**Todos os arquivos**: [MANIFEST.md](computer:///mnt/user-data/outputs/MANIFEST.md)

**Download completo**: [ana-bot.tar.gz](computer:///mnt/user-data/outputs/ana-bot.tar.gz)

**Explorar pasta**: [ana-bot/](computer:///mnt/user-data/outputs/ana-bot/)

---

## ✨ O que a Ana Faz?

- ✅ **Tarefas**: Criar, listar, concluir (com datas e tags)
- 📅 **Reuniões**: Agendar com lembretes 30min antes
- 💰 **Despesas**: Registrar e consultar gastos
- ☀️ **Resumo Diário**: Mensagem automática matinal
- 📊 **Relatórios**: Estatísticas de produtividade
- 💾 **Backup**: Exportar dados em CSV

---

## 🤝 Contribuir

Melhorias são bem-vindas!

1. Fork: https://github.com/ericknadorno/ana-bot-whatsapp
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit: `git commit -m 'Adiciona feature X'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Use e modifique livremente!

---

**🚀 Pronto para começar?** Clone o repo e execute os 3 passos acima!
