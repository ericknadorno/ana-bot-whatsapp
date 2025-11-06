# 📦 Manifesto do Projeto Ana Bot

**Repositório**: https://github.com/ericknadorno/ana-bot-whatsapp

## 📋 Lista Completa de Arquivos

### 📚 Documentação (5 arquivos)

| Arquivo | Descrição | Link |
|---------|-----------|------|
| `README.md` | Documentação completa do projeto | [Ver](computer:///mnt/user-data/outputs/ana-bot/README.md) |
| `QUICK_START.md` | Guia rápido de início | [Ver](computer:///mnt/user-data/outputs/ana-bot/QUICK_START.md) |
| `REPLIT_GUIDE.md` | Guia detalhado para Replit | [Ver](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md) |
| `ARCHITECTURE.md` | Detalhes técnicos e arquitetura | [Ver](computer:///mnt/user-data/outputs/ana-bot/ARCHITECTURE.md) |
| `CHANGELOG.md` | Histórico de versões | [Ver](computer:///mnt/user-data/outputs/ana-bot/CHANGELOG.md) |

### ⚙️ Configuração (7 arquivos)

| Arquivo | Descrição | Link |
|---------|-----------|------|
| `package.json` | Dependências e scripts NPM | [Ver](computer:///mnt/user-data/outputs/ana-bot/package.json) |
| `tsconfig.json` | Configuração TypeScript | [Ver](computer:///mnt/user-data/outputs/ana-bot/tsconfig.json) |
| `.env.example` | Exemplo de variáveis de ambiente | [Ver](computer:///mnt/user-data/outputs/ana-bot/.env.example) |
| `.gitignore` | Arquivos ignorados pelo Git | [Ver](computer:///mnt/user-data/outputs/ana-bot/.gitignore) |
| `schema.sql` | Schema do banco de dados SQLite | [Ver](computer:///mnt/user-data/outputs/ana-bot/schema.sql) |
| `.replit` | Configuração do Replit | [Ver](computer:///mnt/user-data/outputs/ana-bot/.replit) |
| `replit.nix` | Dependências do sistema (Replit) | [Ver](computer:///mnt/user-data/outputs/ana-bot/replit.nix) |

### 🐳 Deploy (3 arquivos)

| Arquivo | Descrição | Link |
|---------|-----------|------|
| `Dockerfile` | Imagem Docker | [Ver](computer:///mnt/user-data/outputs/ana-bot/Dockerfile) |
| `docker-compose.yml` | Orquestração Docker | [Ver](computer:///mnt/user-data/outputs/ana-bot/docker-compose.yml) |
| `Procfile` | Deploy Heroku | [Ver](computer:///mnt/user-data/outputs/ana-bot/Procfile) |

### 📜 Legal (1 arquivo)

| Arquivo | Descrição | Link |
|---------|-----------|------|
| `LICENSE` | Licença MIT | [Ver](computer:///mnt/user-data/outputs/ana-bot/LICENSE) |

### 💻 Código Fonte (14 arquivos TypeScript)

#### 🎯 Arquivos Principais (5 arquivos)

| Arquivo | Linhas | Descrição | Link |
|---------|--------|-----------|------|
| `src/index.ts` | ~100 | Ponto de entrada da aplicação | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/index.ts) |
| `src/bot.ts` | ~250 | Lógica do bot WhatsApp | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/bot.ts) |
| `src/scheduler.ts` | ~150 | Cron jobs e agendamentos | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/scheduler.ts) |
| `src/parsers.ts` | ~200 | Parse de comandos em linguagem natural | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/parsers.ts) |
| `src/messages.ts` | ~250 | Templates de mensagens em português | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/messages.ts) |

#### 📝 Comandos (4 arquivos)

| Arquivo | Linhas | Descrição | Link |
|---------|--------|-----------|------|
| `src/commands/tasks.ts` | ~80 | Gerenciamento de tarefas | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/commands/tasks.ts) |
| `src/commands/meetings.ts` | ~70 | Gerenciamento de reuniões | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/commands/meetings.ts) |
| `src/commands/expenses.ts` | ~150 | Gerenciamento de despesas e relatórios | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/commands/expenses.ts) |
| `src/commands/config.ts` | ~30 | Configurações do bot | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/commands/config.ts) |

#### 🗄️ Banco de Dados (2 arquivos)

| Arquivo | Linhas | Descrição | Link |
|---------|--------|-----------|------|
| `src/db/sqlite.ts` | ~50 | Conexão e inicialização SQLite | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/db/sqlite.ts) |
| `src/db/repositories.ts` | ~350 | Repositories (acesso a dados) | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/db/repositories.ts) |

#### 🛠️ Utilitários (2 arquivos)

| Arquivo | Linhas | Descrição | Link |
|---------|--------|-----------|------|
| `src/utils/time.ts` | ~100 | Manipulação de datas e timezone | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/utils/time.ts) |
| `src/utils/text.ts` | ~80 | Manipulação de texto | [Ver](computer:///mnt/user-data/outputs/ana-bot/src/utils/text.ts) |

## 📊 Estatísticas do Projeto

- **Total de arquivos**: 30
- **Linhas de código TypeScript**: ~2.000+
- **Arquivos de documentação**: 5
- **Arquivos de configuração**: 10
- **Comandos implementados**: 15+
- **Tabelas do banco**: 4 (tasks, meetings, expenses, settings)

## 🚀 Como Começar

### 1️⃣ Clone do GitHub

```bash
git clone https://github.com/ericknadorno/ana-bot-whatsapp.git
cd ana-bot-whatsapp
npm install
```

### 2️⃣ Configure as Variáveis

```bash
cp .env.example .env
# Edite o .env com seus dados
```

### 3️⃣ Compile e Execute

```bash
npm run build
npm start
```

### 4️⃣ Escaneie o QR Code

Use seu WhatsApp para escanear o QR Code que aparece no console.

## 📥 Download

**Projeto completo compactado**: [ana-bot.tar.gz](computer:///mnt/user-data/outputs/ana-bot.tar.gz) (21 KB)

**Pasta completa**: [ana-bot/](computer:///mnt/user-data/outputs/ana-bot/)

## 🔗 Links Úteis

- **Repositório GitHub**: https://github.com/ericknadorno/ana-bot-whatsapp
- **Documentação Completa**: [README.md](computer:///mnt/user-data/outputs/ana-bot/README.md)
- **Guia Replit**: [REPLIT_GUIDE.md](computer:///mnt/user-data/outputs/ana-bot/REPLIT_GUIDE.md)
- **Início Rápido**: [QUICK_START.md](computer:///mnt/user-data/outputs/ana-bot/QUICK_START.md)

## 🎯 Funcionalidades

✅ Gerenciamento de tarefas com datas e tags
✅ Reuniões com lembretes automáticos 30min antes
✅ Controle de despesas por categoria
✅ Resumo diário matinal configurável
✅ Relatórios de produtividade
✅ Backup em CSV
✅ Parse de linguagem natural em português
✅ Suporte a timezone Europe/Lisbon
✅ Restrição por proprietário (segurança)

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5
- **WhatsApp**: whatsapp-web.js
- **Banco**: SQLite (better-sqlite3)
- **Datas**: Luxon + chrono-node
- **Agendamento**: node-cron
- **HTTP**: Express
- **Logging**: Pino
- **Validação**: Zod

## 📋 Estrutura de Pastas

```
ana-bot-whatsapp/
├── src/
│   ├── commands/          # Handlers de comandos
│   ├── db/                # Camada de dados
│   ├── utils/             # Utilitários
│   ├── bot.ts             # Lógica WhatsApp
│   ├── scheduler.ts       # Cron jobs
│   ├── parsers.ts         # Parse de comandos
│   ├── messages.ts        # Templates
│   └── index.ts           # Entry point
├── data/                  # Banco SQLite (criado em runtime)
├── docs/                  # Documentação adicional
├── schema.sql             # Schema do banco
├── package.json           # Dependências
├── tsconfig.json          # Config TypeScript
├── .env.example           # Exemplo de env vars
├── .replit                # Config Replit
├── replit.nix             # Deps sistema Replit
├── Dockerfile             # Imagem Docker
├── docker-compose.yml     # Compose Docker
└── README.md              # Documentação principal
```

## ⚡ Comandos NPM

```bash
npm start        # Executar bot (produção)
npm run dev      # Modo desenvolvimento com watch
npm run build    # Compilar TypeScript
npm run clean    # Limpar build
```

## 🆘 Suporte

Encontrou um problema? Abra uma issue no GitHub:
https://github.com/ericknadorno/ana-bot-whatsapp/issues

## 📄 Licença

MIT License - Veja [LICENSE](computer:///mnt/user-data/outputs/ana-bot/LICENSE)

---

**Desenvolvido com ❤️ para gerenciar sua vida pelo WhatsApp**

Versão 1.0.0 | Última atualização: 06/11/2024
