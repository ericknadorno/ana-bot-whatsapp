# 🏗️ Arquitetura do Ana Bot

## Visão Geral

Ana é um bot de WhatsApp pessoal construído com Node.js, TypeScript e whatsapp-web.js, seguindo princípios de clean architecture e separation of concerns.

## Stack Tecnológica

### Core
- **Node.js** 20+ - Runtime JavaScript
- **TypeScript** 5 - Type safety e developer experience
- **whatsapp-web.js** - Interface com WhatsApp Web

### Banco de Dados
- **better-sqlite3** - Driver SQLite síncrono
- **SQLite** - Banco de dados embarcado

### Agendamento
- **node-cron** - Jobs agendados (resumo diário, lembretes)

### Manipulação de Dados
- **Luxon** - Manipulação de datas/timezone
- **chrono-node** - Parser de linguagem natural para datas

### Validação e Logging
- **Zod** - Schema validation
- **Pino** - Structured logging

### Servidor HTTP
- **Express** - Health check endpoint

## Arquitetura de Camadas

```
┌─────────────────────────────────────┐
│         WhatsApp (User)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Bot Layer (bot.ts)           │
│  - Message handling                 │
│  - Command routing                  │
│  - Access control                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Command Handlers Layer          │
│  - tasks.ts                         │
│  - meetings.ts                      │
│  - expenses.ts                      │
│  - config.ts                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Parsers Layer                  │
│  - Natural language processing      │
│  - Date/time parsing                │
│  - Text extraction                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Repository Layer                 │
│  - TaskRepository                   │
│  - MeetingRepository                │
│  - ExpenseRepository                │
│  - SettingsRepository               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Database (SQLite)              │
└─────────────────────────────────────┘

         ┌────────────────┐
         │   Scheduler    │
         │  - Digest      │
         │  - Reminders   │
         └───────┬────────┘
                 │
         Triggers bot actions
```

## Fluxo de Dados

### Mensagem do Usuário

```
User Message → WhatsApp → bot.ts
                           ↓
                    processCommand()
                           ↓
                    Command Router
                           ↓
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
      tasks handler   meetings handler  expenses handler
           ↓               ↓               ↓
      Parse input     Parse input     Parse input
           ↓               ↓               ↓
      Validate        Validate        Validate
           ↓               ↓               ↓
      Repository      Repository      Repository
           ↓               ↓               ↓
      Database        Database        Database
           ↓               ↓               ↓
      Format response Format response Format response
           ↓               ↓               ↓
           └───────────────┴───────────────┘
                           ↓
                    Reply to user
```

### Cron Jobs

```
Scheduler.start()
    │
    ├─► Digest Job (daily)
    │   └─► Query tasks/meetings for today
    │       └─► Send morning message
    │
    └─► Reminder Job (every minute)
        └─► Query upcoming meetings
            └─► Send reminder 30min before
                └─► Mark as reminded
```

## Estrutura de Diretórios

```
ana-bot/
├── src/
│   ├── index.ts              # Entry point, initialization
│   ├── bot.ts                # WhatsApp client, message handling
│   ├── scheduler.ts          # Cron jobs
│   ├── parsers.ts            # NLP parsing
│   ├── messages.ts           # Message templates
│   │
│   ├── commands/             # Command handlers
│   │   ├── tasks.ts          # Task CRUD operations
│   │   ├── meetings.ts       # Meeting CRUD + snooze
│   │   ├── expenses.ts       # Expense tracking + reports
│   │   └── config.ts         # Settings management
│   │
│   ├── db/                   # Data layer
│   │   ├── sqlite.ts         # DB initialization
│   │   └── repositories.ts   # Data access patterns
│   │
│   └── utils/                # Utilities
│       ├── time.ts           # Date/time helpers
│       └── text.ts           # Text processing
│
├── data/                     # Runtime data
│   └── ana.db                # SQLite database
│
├── schema.sql                # Database schema
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Documentation
```

## Padrões de Design

### Repository Pattern

Cada entidade (Task, Meeting, Expense) tem seu próprio repository que encapsula a lógica de acesso a dados:

```typescript
class TaskRepository {
  constructor(private db: Database) {}
  
  create(...)
  findById(id)
  list(filters)
  update(...)
  delete(id)
}
```

**Benefícios**:
- Separação de responsabilidades
- Facilita testes
- Mudança de banco de dados mais simples

### Command Pattern

Cada comando do usuário tem um handler dedicado:

```typescript
async function handleAddTask(repo, text) {
  const parsed = parseTask(text);
  const task = repo.create(parsed);
  return taskCreatedMessage(task);
}
```

**Benefícios**:
- Fácil adicionar novos comandos
- Código organizado e testável
- Reutilização de lógica

### Strategy Pattern (Parsers)

Diferentes estratégias de parsing para diferentes tipos de input:

```typescript
parseTask(text) // → ParsedTask
parseMeeting(text) // → ParsedMeeting
parseExpense(text) // → ParsedExpense
parsePeriod(text) // → { startTs, endTs }
```

## Decisões Técnicas

### Por que SQLite?

- ✅ Zero configuração
- ✅ Arquivo único, fácil backup
- ✅ Suficiente para usuário único
- ✅ ACID transactions
- ✅ Rápido para leitura/escrita

### Por que better-sqlite3?

- ✅ API síncrona (simples)
- ✅ Melhor performance
- ✅ Type-safe
- ❌ Não usa Promises (simplificação intencional)

### Por que whatsapp-web.js?

- ✅ API completa do WhatsApp
- ✅ Não requer API oficial
- ✅ LocalAuth (persistência de sessão)
- ✅ Comunidade ativa
- ⚠️ Usa Puppeteer (requer Chromium)

### Por que Luxon?

- ✅ Timezone support nativo
- ✅ API moderna e imutável
- ✅ Melhor que Moment.js
- ✅ TypeScript first-class

### Por que chrono-node?

- ✅ Parse de linguagem natural
- ✅ Suporte a português
- ✅ Flexível ("amanhã", "às 14h", "dia 15")

## Fluxo de Inicialização

```
1. Load environment variables (dotenv)
2. Validate config (zod)
3. Initialize database
   3.1. Create data/ directory
   3.2. Open/create ana.db
   3.3. Apply schema.sql if needed
4. Create repositories
5. Create scheduler
6. Initialize WhatsApp client
   6.1. Setup LocalAuth
   6.2. Register event handlers
7. Start Express server (health check)
8. Start WhatsApp client
   8.1. Generate QR code
   8.2. Authenticate
   8.3. Ready
9. Start scheduler
   9.1. Schedule digest job
   9.2. Schedule reminder job
```

## Handling de Mensagens

```typescript
async handleMessage(message) {
  // 1. Ignore grupos
  if (chat.isGroup) return;
  
  // 2. Verificar proprietário
  if (ownerNumber && message.from !== ownerNumber) return;
  
  // 3. Evitar duplicatas
  if (processedMessages.has(messageId)) return;
  
  // 4. Processar comando
  const response = await processCommand(text);
  
  // 5. Enviar resposta
  await message.reply(response);
}
```

## Parsing de Linguagem Natural

### Datas

```typescript
"hoje às 14h" → DateTime { 2024-11-06T14:00:00+00:00 }
"amanhã 10:30" → DateTime { 2024-11-07T10:30:00+00:00 }
"dia 15/11 9h" → DateTime { 2024-11-15T09:00:00+00:00 }
"daqui a 30 min" → DateTime { now + 30 minutes }
```

### Tags

```typescript
"pagar conta #finanças" → tag: "finanças"
"reunião #trabalho #importante" → tag: "trabalho" (primeira)
```

### Local

```typescript
"reunião @Sala 2" → location: "Sala 2"
"@Escritório Central" → location: "Escritório Central"
```

### Participantes

```typescript
"com João" → attendees: ["João"]
"com João e Maria" → attendees: ["João", "Maria"]
"com João, Maria e Pedro" → attendees: ["João", "Maria", "Pedro"]
```

## Agendamento

### Resumo Diário

```typescript
// Cron: "0 8 * * *" (08:00 todo dia)
scheduler.scheduleDigest() {
  const tasks = getTodayTasks();
  const meetings = getTodayMeetings();
  sendMessage(morningDigestMessage(tasks, meetings));
}
```

### Lembretes

```typescript
// Cron: "* * * * *" (cada minuto)
scheduler.checkReminders() {
  const now = currentTime();
  const in30min = now + 30 minutes;
  
  const upcoming = findMeetings(now, in30min);
  
  for (meeting of upcoming) {
    if (!meeting.reminded) {
      sendReminder(meeting);
      markReminded(meeting.id);
    }
  }
}
```

## Persistência

### Schema

```sql
tasks(
  id INTEGER PRIMARY KEY,
  title TEXT,
  due_ts INTEGER,      -- Unix timestamp
  tag TEXT,
  status TEXT,         -- 'open' | 'done'
  created_ts INTEGER,
  updated_ts INTEGER
)

meetings(
  id INTEGER PRIMARY KEY,
  title TEXT,
  start_ts INTEGER,    -- Unix timestamp
  location TEXT,
  attendees TEXT,
  remind30 INTEGER,    -- 1 = yes, 0 = no
  reminded INTEGER,    -- 0 = pending, 1 = sent
  created_ts INTEGER
)

expenses(
  id INTEGER PRIMARY KEY,
  amount_cents INTEGER,  -- Valor em centavos
  currency TEXT,         -- 'EUR'
  category TEXT,
  note TEXT,
  ts INTEGER,           -- Unix timestamp
  created_ts INTEGER
)

settings(
  key TEXT PRIMARY KEY,
  value TEXT
)
```

### Índices

```sql
CREATE INDEX idx_tasks_due_ts ON tasks(due_ts);
CREATE INDEX idx_meetings_start_ts ON meetings(start_ts);
CREATE INDEX idx_expenses_ts ON expenses(ts);
```

## Tratamento de Erros

### Níveis

1. **Database errors**: Logged, usuário recebe mensagem genérica
2. **Parse errors**: Logged, usuário recebe exemplo de uso correto
3. **WhatsApp errors**: Logged, retry automático em alguns casos
4. **Validation errors**: Logged, usuário recebe feedback específico

### Estratégia

```typescript
try {
  // Operação
} catch (error) {
  logger.error({ error }, 'Context');
  return errorMessage('User-friendly message');
}
```

## Performance

### Otimizações

- ✅ Índices em colunas de busca frequente
- ✅ SQLite em modo WAL
- ✅ Cache de mensagens processadas (últimas 100)
- ✅ Queries com LIMIT para evitar overload
- ✅ Prepared statements (SQLite)

### Métricas

- **Tempo de resposta**: < 100ms para comandos simples
- **Memória**: ~150MB em idle
- **Tamanho DB**: ~1-10MB para uso pessoal anual
- **Latência WhatsApp**: ~1-3s (dependente do WhatsApp)

## Segurança

### Autenticação

- WhatsApp LocalAuth (session persistida)
- OWNER_NUMBER validation (ACL simples)

### Dados

- SQLite local (não exposto)
- Sem senhas armazenadas
- Sem dados sensíveis em logs

### Limitações

- Sem criptografia E2E extra (confia no WhatsApp)
- Sem rate limiting (usuário único)
- Sem autenticação multi-fator

## Testes

### Estrutura Sugerida

```
tests/
├── unit/
│   ├── parsers.test.ts
│   ├── repositories.test.ts
│   └── utils/
├── integration/
│   ├── commands.test.ts
│   └── scheduler.test.ts
└── e2e/
    └── bot.test.ts
```

### Comandos

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:coverage # Coverage report
```

## Extensibilidade

### Adicionar Novo Comando

1. Criar handler em `src/commands/`
2. Adicionar parser em `src/parsers.ts`
3. Adicionar template em `src/messages.ts`
4. Registrar em `bot.ts` → `processCommand()`
5. Atualizar `HELP_MESSAGE`

### Adicionar Nova Entidade

1. Criar tabela em `schema.sql`
2. Adicionar repository em `src/db/repositories.ts`
3. Criar handlers de comando
4. Adicionar ao bot routing

### Suportar Novo Idioma

1. Configurar chrono-node para o idioma
2. Traduzir templates em `messages.ts`
3. Ajustar parsers de comando
4. Atualizar documentação

## Monitoramento

### Logs

```typescript
logger.info({ context }, 'message');
logger.error({ error }, 'message');
logger.debug({ details }, 'message');
```

### Health Check

```
GET /health
→ { status: 'ok', timestamp: '...' }
```

### Métricas Sugeridas

- Mensagens processadas/dia
- Comandos mais usados
- Tempo médio de resposta
- Erros/dia
- Uptime

## Deploy

### Plataformas Suportadas

- ✅ Replit (recomendado para iniciantes)
- ✅ Docker (recomendado para produção)
- ✅ VPS (Node.js direto)
- ✅ Heroku (com buildpack)
- ⚠️ Vercel/Netlify (Não recomendado - precisam serverless)

### Requisitos Mínimos

- CPU: 1 core
- RAM: 512MB
- Disco: 1GB
- Node.js 18+
- Chromium

## Limitações Conhecidas

1. **Usuário único**: Não suporta múltiplos usuários nativamente
2. **WhatsApp Web**: Depende da estabilidade do WhatsApp Web
3. **Chromium**: Requer Chromium/Chrome instalado
4. **Reconexão**: Precisa rescanear QR após muito tempo offline
5. **Grupos**: Não funciona em grupos (por design)

## Futuras Melhorias

### Curto Prazo
- [ ] Testes unitários
- [ ] CI/CD pipeline
- [ ] Backup automático do banco
- [ ] Webhook para eventos externos

### Médio Prazo
- [ ] Multi-usuário (com autenticação)
- [ ] Interface web para configuração
- [ ] Integração com Google Calendar
- [ ] Export para formato JSON

### Longo Prazo
- [ ] Machine Learning para sugestões
- [ ] Análise de produtividade
- [ ] Integração com mais serviços
- [ ] App mobile complementar

## Contribuindo

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Escreva testes
4. Submeta um Pull Request

## Licença

MIT License - Veja [LICENSE](LICENSE)

---

**Documentação técnica - Ana Bot v1.0.0**
