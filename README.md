# 🤖 Ana Bot - Assistente Pessoal WhatsApp

**Repositório GitHub**: https://github.com/ericknadorno/ana-bot-whatsapp

---

## 🎯 Início Rápido

Escolha seu caminho:

| 🚀 Opção | 📄 Documento | ⏱️ Tempo |
|----------|-------------|----------|
| **Começar já** | [START_HERE.md](computer:///mnt/user-data/outputs/START_HERE.md) | 3 min |
| **Deploy Replit** | [REPLIT_GUIDE.md](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md) | 10 min |
| **Guia rápido** | [QUICK_START.md](computer:///mnt/user-data/outputs/ana-bot/QUICK_START.md) | 5 min |
| **Documentação completa** | [README.md](computer:///mnt/user-data/outputs/ana-bot/README.md) | 20 min |

---

## 📥 Downloads

| Item | Link |
|------|------|
| 📦 **Projeto Completo** (tar.gz) | [ana-bot.tar.gz](computer:///mnt/user-data/outputs/ana-bot.tar.gz) |
| 📂 **Navegar Arquivos** | [ana-bot/](computer:///mnt/user-data/outputs/ana-bot/) |
| 📋 **Lista de Arquivos** | [MANIFEST.md](computer:///mnt/user-data/outputs/MANIFEST.md) |

---

## 📂 Arquivos Principais

### Configuração Essencial

| Arquivo | Descrição |
|---------|-----------|
| [package.json](computer:///mnt/user-data/outputs/ana-bot/package.json) | Dependências NPM |
| [.env.example](computer:///mnt/user-data/outputs/ana-bot/.env.example) | Variáveis de ambiente |
| [schema.sql](computer:///mnt/user-data/outputs/ana-bot/schema.sql) | Schema do banco SQLite |
| [tsconfig.json](computer:///mnt/user-data/outputs/ana-bot/tsconfig.json) | Config TypeScript |

### Deploy

| Arquivo | Plataforma |
|---------|-----------|
| [.replit](computer:///mnt/user-data/outputs/ana-bot/.replit) + [replit.nix](computer:///mnt/user-data/outputs/ana-bot/replit.nix) | Replit |
| [Dockerfile](computer:///mnt/user-data/outputs/ana-bot/Dockerfile) + [docker-compose.yml](computer:///mnt/user-data/outputs/ana-bot/docker-compose.yml) | Docker |
| [Procfile](computer:///mnt/user-data/outputs/ana-bot/Procfile) | Heroku |

### Código Fonte

| Diretório | Arquivos |
|-----------|----------|
| [src/](computer:///mnt/user-data/outputs/ana-bot/src/) | 14 arquivos TypeScript |
| [src/commands/](computer:///mnt/user-data/outputs/ana-bot/src/commands/) | Handlers de comandos |
| [src/db/](computer:///mnt/user-data/outputs/ana-bot/src/db/) | Repositories e SQLite |
| [src/utils/](computer:///mnt/user-data/outputs/ana-bot/src/utils/) | Utilitários |

**Arquivos principais**:
- [src/index.ts](computer:///mnt/user-data/outputs/ana-bot/src/index.ts) - Entry point
- [src/bot.ts](computer:///mnt/user-data/outputs/ana-bot/src/bot.ts) - Lógica WhatsApp
- [src/scheduler.ts](computer:///mnt/user-data/outputs/ana-bot/src/scheduler.ts) - Cron jobs
- [src/parsers.ts](computer:///mnt/user-data/outputs/ana-bot/src/parsers.ts) - Parse de comandos
- [src/messages.ts](computer:///mnt/user-data/outputs/ana-bot/src/messages.ts) - Templates PT

---

## 📚 Documentação

| Documento | Para Quem |
|-----------|-----------|
| [START_HERE.md](computer:///mnt/user-data/outputs/START_HERE.md) | Quem quer começar agora |
| [QUICK_START.md](computer:///mnt/user-data/outputs/ana-bot/QUICK_START.md) | Guia rápido com 3 opções |
| [REPLIT_GUIDE.md](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md) | Deploy detalhado no Replit |
| [README.md](computer:///mnt/user-data/outputs/ana-bot/README.md) | Documentação completa |
| [ARCHITECTURE.md](computer:///mnt/user-data/outputs/ana-bot/ARCHITECTURE.md) | Desenvolvedores |
| [MANIFEST.md](computer:///mnt/user-data/outputs/MANIFEST.md) | Lista de todos os arquivos |
| [CHANGELOG.md](computer:///mnt/user-data/outputs/ana-bot/CHANGELOG.md) | Histórico de versões |

---

## 🚀 Instalação

### Via GitHub

```bash
git clone https://github.com/ericknadorno/ana-bot-whatsapp.git
cd ana-bot-whatsapp
npm install
cp .env.example .env
# Edite o .env
npm run build
npm start
```

### Via Replit

1. Import: `https://github.com/ericknadorno/ana-bot-whatsapp`
2. Configure Secrets
3. Run

[Guia completo Replit →](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md)

---

## ✨ Funcionalidades

- ✅ Gerenciar tarefas (com datas e tags)
- 📅 Agendar reuniões (lembretes 30min antes)
- 💰 Controlar despesas (por categoria)
- ☀️ Resumo diário matinal
- 📊 Relatórios de produtividade
- 💾 Backup em CSV
- 🇵🇹 Parse de datas em português
- 🕐 Timezone Europe/Lisbon
- 🔐 Restrição por proprietário

---

## 📊 Estatísticas

- **Total de arquivos**: 30
- **Linhas de código**: ~2.000+
- **Comandos disponíveis**: 15+
- **Documentação**: 5 guias completos

---

## 🛠️ Stack

- Node.js 20+ / TypeScript 5
- whatsapp-web.js
- SQLite (better-sqlite3)
- Luxon + chrono-node
- node-cron
- Express + Pino

---

## 📱 Comandos Principais

```
ajuda                              # Ver todos os comandos
add tarefa pagar conta às 14h      # Criar tarefa
minhas tarefas hoje                # Listar tarefas
reunião amanhã às 10h: alinhamento # Agendar reunião
despesa 12.50 almoço              # Registrar gasto
gastos semana                      # Ver despesas
relatório mês                      # Relatório completo
config resumo 07:30                # Mudar horário resumo
backup                             # Exportar dados
```

---

## 🆘 Suporte

**Problemas?** Consulte:
1. [Troubleshooting no README](computer:///mnt/user-data/outputs/ana-bot/README.md#-troubleshooting)
2. [Issues no GitHub](https://github.com/ericknadorno/ana-bot-whatsapp/issues)

---

## 📄 Licença

MIT License - [Ver LICENSE](computer:///mnt/user-data/outputs/ana-bot/LICENSE)

---

## 🎯 Próximos Passos

1. **Clone o repositório** do GitHub
2. **Leia** [START_HERE.md](computer:///mnt/user-data/outputs/START_HERE.md)
3. **Configure** as variáveis de ambiente
4. **Execute** e escaneie o QR Code
5. **Envie** "ajuda" no WhatsApp

---

**Desenvolvido com ❤️ para gerenciar sua vida pelo WhatsApp**

v1.0.0 | GitHub: https://github.com/ericknadorno/ana-bot-whatsapp
