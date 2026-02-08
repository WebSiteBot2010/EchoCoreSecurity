require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Discord OAuth Configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DISCORD_API_URL = 'https://discordapp.com/api';

// Routes

// 1. Inizia il login Discord
app.get('/discord', (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds`;
  res.redirect(discordAuthUrl);
});

// 2. Callback di Discord
app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  try {
    // Scambia il codice con un token
    const tokenResponse = await axios.post(`${DISCORD_API_URL}/oauth2/token`, new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: DISCORD_REDIRECT_URI,
      scope: 'identify email guilds'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenResponse.data.access_token;

    // Ottieni i dati dell'utente
    const userResponse = await axios.get(`${DISCORD_API_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userResponse.data;

    // Salva l'utente in sessione
    req.session.user = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      email: user.email,
      avatar: user.avatar,
      access_token: access_token
    };

    res.redirect('/?swal=logged');
  } catch (error) {
    console.error('Discord callback error:', error.response?.data || error.message);
    res.redirect('/?error=auth_failed');
  }
});

// 3. Verifica se l'utente è autenticato
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        email: req.session.user.email,
        avatar: req.session.user.avatar ? `https://cdn.discordapp.com/avatars/${req.session.user.id}/${req.session.user.avatar}.png` : null
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// 4. Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// 5. Statistiche (placeholder - collega al tuo bot MongoDB)
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: Connetti al database MongoDB del bot per ottenere i dati reali
    // Per ora ritorniamo dati placeholder
    
    const stats = {
      serverCount: 0,
      totalUsers: 0,
      reportedUsers: 0
    };

    // Se hai il bot connesso, puoi fare query al database qui
    // const botStats = await BotStats.findOne();
    // stats.serverCount = botStats.servers;
    // stats.totalUsers = botStats.users;
    // stats.reportedUsers = botStats.reported;

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 6. Serve il file index.html per tutte le altre rotte
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 EchoSecurity Dashboard Backend is running on http://localhost:${PORT}`);
  console.log(`📝 Remember to set your Discord OAuth credentials in .env file\n`);
});
