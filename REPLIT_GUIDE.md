# 🚀 Guia Completo: Deploy no Replit

## Passo 1: Criar Conta no Replit

1. Acesse https://replit.com
2. Clique em "Sign up" (pode usar GitHub, Google ou email)
3. Confirme seu email

## Passo 2: Criar Novo Repl

### Opção A: Upload de Arquivos
1. Clique em "+ Create Repl"
2. Selecione "Upload Files"
3. Faça upload do arquivo `ana-bot.tar.gz` ou arraste a pasta `ana-bot`
4. Aguarde o upload completar

### Opção B: Import do GitHub (Recomendado)
1. Clique em "+ Create Repl"
2. Selecione "Import from GitHub"
3. Cole a URL: `https://github.com/ericknadorno/ana-bot-whatsapp`
4. Clique em "Import from GitHub"

## Passo 3: Configurar Secrets (Variáveis de Ambiente)

1. No seu Repl, procure o ícone de **cadeado** 🔒 na barra lateral esquerda
2. Clique em "Secrets"
3. Adicione as seguintes variáveis:

### Variáveis Obrigatórias

**TZ** (Fuso horário)
```
Key: TZ
Value: Europe/Lisbon
```

### Variáveis Opcionais (mas recomendadas)

**OWNER_NUMBER** (Seu número do WhatsApp)
```
Key: OWNER_NUMBER
Value: 3519xxxxxxxx@c.us
```

⚠️ **Como obter seu OWNER_NUMBER?**
- Seu número: +351 912 345 678
- Formato: `351912345678@c.us`
- Remova espaços, +, parênteses
- Adicione `@c.us` no final

**MORNING_DIGEST_HOUR** (Hora do resumo diário)
```
Key: MORNING_DIGEST_HOUR
Value: 8
```

**MORNING_DIGEST_MINUTE** (Minuto do resumo)
```
Key: MORNING_DIGEST_MINUTE
Value: 0
```

**LOG_LEVEL** (Nível de log)
```
Key: LOG_LEVEL
Value: info
```

## Passo 4: Instalar Dependências

1. No Replit, abra o **Shell** (ícone do terminal)
2. Execute:

```bash
npm install
```

3. Aguarde a instalação completar (pode levar 2-3 minutos)

## Passo 5: Compilar TypeScript

No Shell, execute:

```bash
npm run build
```

## Passo 6: Iniciar o Bot

### Opção A: Botão Run
Simplesmente clique no botão verde **"Run"** no topo

### Opção B: Comando manual
No Shell:
```bash
npm start
```

## Passo 7: Conectar WhatsApp

1. **Aguarde o QR Code aparecer** no console (pode levar 30-60 segundos)
2. **No seu celular**:
   - Abra o WhatsApp
   - Vá em **Configurações** → **Aparelhos Conectados**
   - Toque em **Conectar Aparelho**
3. **Escaneie o QR Code** que aparece no console do Replit
4. **Aguarde a mensagem**: `WhatsApp client ready`

## Passo 8: Testar

Envie uma mensagem para você mesmo no WhatsApp:

```
ajuda
```

Você deve receber a lista de comandos da Ana! 🎉

## 🔧 Configurações Adicionais no Replit

### Always On (Opcional - Plano Pago)

Para manter o bot sempre online:

1. Clique nos 3 pontinhos (⋮) ao lado do botão "Run"
2. Selecione "Always On"
3. Confirme a assinatura

### Keepalive Grátis (Alternativa)

Se não quiser pagar, use um serviço de ping:

1. Após o bot iniciar, copie a URL do Repl (algo como `https://seu-repl.usuario.repl.co`)
2. Cadastre em https://uptimerobot.com
3. Crie um monitor HTTP para `https://seu-repl.usuario.repl.co/health`
4. Configure ping a cada 5 minutos

## 🐛 Problemas Comuns

### QR Code não aparece

**Solução 1**: Aguarde mais tempo (até 2 minutos)

**Solução 2**: Reinicie o Repl
```bash
# No Shell:
pkill -f node
npm start
```

### "Authentication failure"

**Solução**: Limpe a sessão anterior
```bash
# No Shell:
rm -rf .wwebjs_auth
npm start
```

### Bot não responde

**Verifique**:
1. O OWNER_NUMBER está no formato correto?
2. Você escaneou o QR Code?
3. Veja os logs no console

**Debug**:
```bash
# Ative logs detalhados:
# Vá em Secrets e mude LOG_LEVEL para 'debug'
# Reinicie o bot
```

### "Cannot find module"

**Solução**: Reinstale as dependências
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
npm start
```

### Bot desconecta sozinho

**Causa**: Replit hiberna projetos inativos no plano gratuito

**Soluções**:
1. Use "Always On" (pago)
2. Configure UptimeRobot (grátis)
3. Abra o Repl pelo menos 1x por dia

### Erro de compilação TypeScript

**Solução**:
```bash
npm run clean
npm run build
```

## 📊 Monitoramento

### Ver logs em tempo real
```bash
# No Shell:
npm start
# ou se já estiver rodando:
tail -f ~/.pm2/logs/*
```

### Verificar saúde do bot
No navegador, acesse:
```
https://seu-repl.usuario.repl.co/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

## 🔄 Atualizações

Para atualizar o código:

1. Edite os arquivos no Replit
2. Pare o bot (Ctrl+C ou Stop)
3. Recompile:
```bash
npm run build
```
4. Reinicie:
```bash
npm start
```

## 💾 Backup dos Dados

### Backup manual

Os dados estão em `data/ana.db`. Para fazer backup:

1. No Shell:
```bash
# Criar backup com timestamp
cp data/ana.db data/ana-backup-$(date +%Y%m%d-%H%M%S).db
```

2. Download: Clique com botão direito em `data/ana.db` → Download

### Backup via WhatsApp

Envie para você mesmo:
```
backup
```

Isso retorna um CSV com tarefas e despesas dos últimos 90 dias.

## 🎯 Primeiros Comandos para Testar

```
ajuda
add tarefa testar Ana às 14h
minhas tarefas
reunião amanhã às 10h: teste de reunião
listar reuniões
despesa 10 teste
gastos hoje
relatório hoje
config resumo 08:00
```

## 📱 Usando a Ana

Depois de tudo configurado, leia o [README.md](README.md) para ver:
- Todos os comandos disponíveis
- Exemplos de uso
- Dicas e truques

## 🆘 Ainda com Problemas?

1. Confira a seção **Troubleshooting** no [README.md](README.md)
2. Verifique os logs no console do Replit
3. Tente o modo debug (`LOG_LEVEL=debug`)

## ✅ Checklist Final

- [ ] Conta no Replit criada
- [ ] Projeto importado/uploaded
- [ ] Secrets configurados (TZ, OWNER_NUMBER)
- [ ] `npm install` executado com sucesso
- [ ] `npm run build` executado com sucesso
- [ ] Bot iniciado (`npm start`)
- [ ] QR Code escaneado
- [ ] Mensagem "WhatsApp client ready" apareceu
- [ ] Comando "ajuda" funciona no WhatsApp
- [ ] UptimeRobot configurado (opcional)

## 🎉 Pronto!

Sua Ana está rodando! Agora você pode gerenciar tarefas, reuniões e despesas direto do WhatsApp.

**Dica final**: Configure o resumo diário para seu horário preferido:
```
config resumo 07:30
```

---

**Dúvidas?** Releia o [README.md](README.md) ou abra uma issue.
