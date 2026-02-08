# Quick Start Guide

## Prerequisiti
- Node.js v16+ (scarica da https://nodejs.org/)
- Un account Discord
- Un Discord Bot Application (per OAuth)

## Setup Veloce (5 minuti)

### Passo 1: Configura Discord OAuth
1. Vai su https://discord.com/developers/applications
2. Clicca "New Application", dai un nome
3. Copia il **CLIENT ID** e **CLIENT SECRET** da OAuth2
4. Aggiungi Redirect URI: `http://localhost:5000/auth/discord/callback`

### Passo 2: Configura il Backend
```bash
cd backend

# Copia il file di configurazione
cp .env.example .env

# Modifica .env con i tuoi valori
nano .env
# O usa il tuo editor preferito
```

Incolla in `.env`:
```
DISCORD_CLIENT_ID=INSERISCI_QUI
DISCORD_CLIENT_SECRET=INSERISCI_QUI
DISCORD_REDIRECT_URI=http://localhost:5000/auth/discord/callback
SESSION_SECRET=una_stringa_casuale_sicura
```

### Passo 3: Installa e Avvia
```bash
# Installa dipendenze
npm install

# Avvia il server
npm start
```

Dovresti vedere:
```
🚀 EchoSecurity Dashboard Backend is running on http://localhost:5000
```

### Passo 4: Apri la Dashboard
- Apri il browser: http://localhost:5000
- Clicca "Entra" nel menu
- Autorizza con Discord
- Sei dentro! ✅

## Comandi Utili

```bash
# Avvio in modalità svil uppo (auto-reload)
npm run dev

# Verifica lo stato del server
curl http://localhost:5000/api/user

# Vedi i log
npm start
```

## Problemi comuni?

**Il login non funziona**
→ Controlla che redirect URI sia esattamente uguale in Discord e in `.env`

**"Cannot find module"**
→ Esegui `npm install`

**La porta 5000 è già in uso**
→ Cambia `PORT=3000` in `.env` e accedi da `http://localhost:3000`

## Architettura

```
Frontend (index.html)
    ↓
Backend (Node.js/Express)
    ↓ OAuth
Discord
```

## Cosa fare dopo
1. Connetti il database MongoDB per le statistiche reali
2. Configura il deploy (Vercel, Heroku, AWS, etc)
3. Personalizza l'interfaccia dashboard
4. Aggiungi altre funzionalità come comandi, automod, etc

## Aiuto
Leggi `/backend/README.md` per dettagli tecnici completi
