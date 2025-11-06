# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2024-11-06

### Adicionado
- ✅ Bot WhatsApp completo com whatsapp-web.js
- 📝 Sistema de gerenciamento de tarefas
  - Criar tarefas com data/hora e tags
  - Listar tarefas por período
  - Concluir e remover tarefas
- 📅 Sistema de reuniões
  - Criar reuniões com local e participantes
  - Lembretes automáticos 30 minutos antes
  - Função snooze para adiar lembretes
- 💰 Controle de despesas
  - Registrar despesas com categoria
  - Consultar gastos por período
  - Relatórios com totais e categorias
- ☀️ Resumo diário matinal automático
- ⚙️ Configuração de horário do resumo
- 📊 Relatórios de produtividade
- 💾 Sistema de backup em CSV
- 🗄️ Banco de dados SQLite
- 🕐 Suporte completo para timezone Europe/Lisbon
- 🇵🇹 Parser de datas em português (chrono-node)
- 🔐 Restrição de acesso por OWNER_NUMBER
- 📝 Logging com pino
- 🏥 Health check endpoint
- 📚 Documentação completa
- 🐳 Suporte Docker
- 🔄 Configuração para Replit
- 🚀 Guia de início rápido

### Tecnologias
- Node.js 20+
- TypeScript 5
- whatsapp-web.js
- SQLite (better-sqlite3)
- node-cron
- Luxon para datas
- Chrono para parse de linguagem natural
- Zod para validação
- Pino para logging

### Estrutura
- Arquitetura modular com separação de responsabilidades
- Repositories pattern para acesso a dados
- Command handlers isolados
- Parsers de linguagem natural
- Scheduler para tarefas agendadas
