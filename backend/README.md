# EchoSecurity Dashboard Backend Setup Guide

## Cos'è stato creato

Ho creato un backend Node.js + Express che gestisce:
- ✅ **OAuth Discord**: Login tramite Discord
- ✅ **Sessioni utente**: Mantiene gli utenti autenticati
- ✅ **API per statistiche**: Fornisce dati al frontend
- ✅ **Logout**: Distrugge la sessione

## Come configurare

### 1. Installa le dipendenze

```bash
cd backend
npm install
```

### 2. Crea il file `.env`

Copia `.env.example` in `.env` e configura:

```bash
cp .env.example .env
```

### 3. Configura Discord OAuth

**Vai su**: https://discord.com/developers/applications

1. Crea una nuova applicazione (o usa quella esistente del bot)
2. Vai su **OAuth2 > General**
3. Copia il **CLIENT ID** e **CLIENT SECRET**
4. Aggiungi il Redirect URI: `http://localhost:5000/auth/discord/callback` (o il tuo dominio in produzione)

Incolla i valori in `.env`:

```env
DISCORD_CLIENT_ID=your_id_here
DISCORD_CLIENT_SECRET=your_secret_here
DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback
SESSION_SECRET=una_stringa_sicura_casuale_qui
```

### 4. Avvia il server

```bash
npm start
```

Dovresti vedere:
```
🚀 EchoSecurity Dashboard Backend is running on http://localhost:5000
```

## Come funziona il flusso di login

1. L'utente clicca **"Entra"** (bottone nella sidebar)
2. Viene reindirizzato a Discord per l'autorizzazione
3. Discord lo reindirizza al callback: `/auth/discord/callback?code=...`
4. Il backend scambia il codice con un token di accesso
5. Il backend crea una sessione e reindirizza a `/?swal=logged`
6. Il frontend verifica se autenticato e mostra l'username

## Cosa devi ancora fare

### Connettere il Database MongoDB

Nel file `backend/server.js`, nella rotta `/api/stats`, collega il tuo bot Discord per ottenere i dati reali:

```javascript
// Sostituisci questo
const stats = {
  serverCount: 0,
  totalUsers: 0,
  reportedUsers: 0
};
```

Con la query al tuo database MongoDB (dove il bot salva le segnalazioni):

```javascript
const botStats = await YourBotModel.findOne();
const stats = {
  serverCount: botStats.guildCount,
  totalUsers: botStats.totalUsers,
  reportedUsers: botStats.reportedCount
};
```

### Opzionale: Usa Nodemon in sviluppo

```bash
npm run dev
```

Questo riavvia il server automaticamente quando modifichi i file.

## File struktura

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env.example       # Environment variables template
└── .env              # Your actual config (add to .gitignore)
```

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Invalid OAuth2 code"
Controlla che il redirect URI in Discord Application sia esattamente uguale a `DISCORD_REDIRECT_URI` nel `.env`

### La sessione non persiste
Assicurati che i cookie siano abilitati e che il `SESSION_SECRET` sia una stringa casuale sicura

## Prossimi step

1. ✅ Connetti il bot MongoDB per statistiche reali
2. Aggiungi protezione CSRF se necessario
3. Configura HTTPS per produzione
4. Aggiungi limiti di rate-limiting
5. Implementa refresh token per mantenere sessioni più a lungo
