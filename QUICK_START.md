# 🚀 Início Rápido - Ana Bot

**Repositório**: https://github.com/ericknadorno/ana-bot-whatsapp

## Opção 1: Replit (Mais Fácil)

1. **Criar conta no Replit**: https://replit.com
2. **Import from GitHub**: `https://github.com/ericknadorno/ana-bot-whatsapp`
3. **Configure Secrets** (botão de cadeado):
   ```
   TZ=Europe/Lisbon
   OWNER_NUMBER=3519xxxxxxxx@c.us
   ```
4. **Clique em "Run"**
5. **Escaneie o QR Code** que aparece no console
6. **Pronto!** Envie "ajuda" no WhatsApp

## Opção 2: Local (Node.js)

```bash
# 1. Clone o repositório
git clone https://github.com/ericknadorno/ana-bot-whatsapp.git
cd ana-bot-whatsapp

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com seus dados

# 4. Compile TypeScript
npm run build

# 5. Inicie o bot
npm start

# 6. Escaneie o QR Code
```

## Opção 3: Docker

```bash
# 1. Configure .env
cp .env.example .env
# Edite o .env

# 2. Build e start
docker-compose up -d

# 3. Ver QR Code
docker-compose logs -f

# 4. Escaneie o QR Code
```

## Obtendo seu OWNER_NUMBER

Não sabe seu número no formato correto? Duas opções:

### Opção A: Sem OWNER_NUMBER primeiro
1. Não configure `OWNER_NUMBER` na primeira vez
2. Inicie o bot
3. Envie uma mensagem qualquer
4. Veja nos logs algo como: `from: '3519xxxxxxxx@c.us'`
5. Copie esse número completo
6. Configure `OWNER_NUMBER` e reinicie

### Opção B: Formato manual
- Seu número: +351 912 345 678
- Formato correto: `351912345678@c.us`
- Regra: [código do país][número sem espaços]@c.us

## Primeiros Comandos

Após conectar, teste:

```
ajuda
add tarefa teste
minhas tarefas
reunião amanhã às 10h: teste
despesa 10 teste
```

## Problemas Comuns

**QR Code não aparece?**
- Aguarde 30 segundos
- Reinicie o bot

**Bot não responde?**
- Verifique se escaneou o QR Code
- Confirme que o `OWNER_NUMBER` está correto
- Veja os logs: `docker-compose logs -f` ou no Replit

**"Authentication failure"?**
- Delete a sessão antiga: `rm -rf .wwebjs_auth/`
- Reinicie e escaneie novamente

## Próximos Passos

Leia o [README.md](README.md) completo para:
- Todos os comandos disponíveis
- Configurações avançadas
- Troubleshooting detalhado
- Exemplos de uso

## Suporte

Encontrou um problema? Abra uma issue no GitHub.

---

**Dica**: Configure o resumo diário para seu horário preferido:
```
config resumo 07:30
```
