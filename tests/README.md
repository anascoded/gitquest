# GitQuest 🎮
### Operation Shadow Breach — Learn Git Through Immersive Hacker Missions

GitQuest is an interactive web application that teaches Git through story-driven missions. Players take on the role of a cyber agent fighting a hacker group called **Shadow Breach**, learning real Git commands through hands-on field scenarios, progressive levels, a live leaderboard, trophies, and a coin-based reward system.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Seeding the Database](#seeding-the-database)
- [API Reference](#api-reference)
- [Game Design](#game-design)
- [Team](#team)

---

## Overview

GitQuest is a learning platform for Git. Agents progress through 30 missions across 3 difficulty levels — Beginner, Intermediate, and Advanced — each teaching a specific Git command through a spy-themed scenario. Progress, coins, trophies, and streaks are all persisted in MongoDB so agents can pick up where they left off from any device.

---

## Features

- 🎯 **30 Missions** across 3 levels — Beginner, Intermediate, Advanced
- 🔐 **Agent Authentication** — Sign up / sign in with email and password, JWT via HTTP-only cookies
- 📈 **Live Progress Tracking** — Mission completion saved to MongoDB per agent
- 💰 **Coin System** — Earn 10 coins per completed mission, spend them in the Collectibles store
- 🔥 **Daily Streak** — Resets to 0 if you miss a day, tracked on every sign-in
- 🏆 **20 Trophies** — Unlocked by hitting milestones (speed, streaks, perfect attempts, level completion, etc.)
- 🎖️ **Agent Dossier** — Live stats: missions complete, battles won, perfect attempts, hints used, coins earned
- 🗺️ **Mission Map** — Visual level map with lock/unlock progression
- 🔒 **Mission Locking** — New Recruits must complete missions in order; completed missions are freely revisitable
- 🎵 **Background Music** — Plays across map and mission screens, toggle on/off
- 🛒 **Collectibles** — Tools, boosts, and cosmetics purchasable with coins
- 🏅 **Trophy Room** — All 20 trophies with rarity tiers (Common, Uncommon, Rare, Legendary)
- 📊 **Leaderboard** — Top 10 agents ranked by XP

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JavaScript, Vite |
| Backend | Node.js v22, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Auth | JWT, bcryptjs, HTTP-only cookies |
| Styling | Inline React styles (monospace hacker aesthetic) |
| Dev Tools | Nodemon, ESLint, Husky |

---

## Project Structure

```
gitquest/
├── backend/                    ← Express API server
│   ├── models/
│   │   ├── Agent.js            ← Agent schema (auth, coins, streak, XP)
│   │   ├── AgentArsenal.js     ← Agent ↔ Collectible junction
│   │   ├── AgentProgress.js    ← Mission completion records per agent
│   │   ├── AgentTrophy.js      ← Trophy unlock records per agent
│   │   ├── Arsenal.js          ← Collectible items
│   │   ├── Battle.js           ← Battle attempt records
│   │   ├── Command.js          ← Git command + hint + regex validator
│   │   ├── Level.js            ← Level definitions (1–3)
│   │   ├── Mission.js          ← Mission definitions
│   │   └── Trophy.js           ← Trophy definitions
│   ├── routes/
│   │   ├── agents.js           ← Agent profile, leaderboard
│   │   ├── arsenal.js          ← Collectibles shop + unlock
│   │   ├── auth.js             ← Sign up, sign in, sign out, /me
│   │   ├── battles.js          ← Record battle completions
│   │   ├── levels.js           ← Fetch all levels
│   │   ├── missions.js         ← Fetch missions + progress
│   │   ├── stats.js            ← Agent dossier stats
│   │   └── trophies.js         ← Fetch trophies + evaluate unlocks
│   ├── middleware/
│   │   └── auth.js             ← JWT requireAuth middleware
│   ├── audio/
│   │   └── Trent Reznor - Intriguing Possibilities.wav
│   ├── seed.js                 ← Seeds levels, missions, commands
│   ├── seedTrophies.js         ← Seeds 20 trophy definitions
│   ├── server.js               ← Express app entry point
│   ├── .env                    ← Environment variables (not committed)
│   └── package.json
│
├── gitquest-ui/                ← React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.js         ← signIn, signUp, signOut, getMe
│   │   ├── components/
│   │   │   ├── Arsenal.jsx     ← Collectibles store UI
│   │   │   ├── MissionMap.jsx  ← Level map with node progression
│   │   │   ├── SignInPage.jsx  ← Agent authentication
│   │   │   ├── SignUpPage.jsx  ← Agent registration
│   │   │   ├── TrainingPage.jsx← Mission training + battle
│   │   │   ├── TrophyRoom.jsx  ← Trophy room + agent dossier
│   │   │   └── WelcomeScreen.jsx
│   │   ├── context/
│   │   │   └── ProgressContext.jsx ← Mission progress + coins (DB-backed)
│   │   ├── App.jsx             ← Root app + screen routing + audio
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── tests/                      ← Test suite
```

---

## Prerequisites

Make sure you have the following installed before running the project:

- [Node.js v18+](https://nodejs.org/) (project uses v22.19.0)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free M0 tier is sufficient)
- A modern browser (Chrome, Firefox, Edge)

---

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/anascoded/gitquest.git
cd gitquest
```

### 2. Create the backend `.env` file

Inside the `backend/` folder, create a file called `.env`:

```bash
cd backend
touch .env
```

Add the following variables:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gitquest?appName=GitQuest
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

Replace:
- `<username>` — your MongoDB Atlas username
- `<password>` — your MongoDB Atlas password (encode `@` as `%40` if present)
- `<cluster>` — your Atlas cluster hostname

> **Important:** Make sure your IP address is whitelisted in MongoDB Atlas under **Network Access**. For development, you can allow access from anywhere (`0.0.0.0/0`).

---

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:

```
✔ Connected to MongoDB
✔ Server running on port 5001
```

The API will be available at `http://localhost:5001`.

---

## Running the Frontend

Open a **second terminal** (keep the backend running):

```bash
cd gitquest-ui
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> Both the backend and frontend must be running simultaneously for the app to work.

---

## Seeding the Database

After the backend is connected, populate the database with levels, missions, commands, and trophies by running the seed scripts from the `backend/` folder.

### Seed levels, missions, and commands (30 total)

```bash
cd backend
node seed.js
```

Expected output:

```
✔ Connected to MongoDB
✔ Cleared existing levels, missions, commands
✔ Inserted 3 levels
✔ Inserted 30 missions
✔ Inserted 30 commands
✔ Database seeded successfully
```

### Seed trophies (20 total)

```bash
node seedTrophies.js
```

Expected output:

```
✔ Connected to MongoDB
✔ Seeded 20 trophies
```

> Re-running either seed script will clear and re-insert the data cleanly.

---

## API Reference

All routes are prefixed with `/api`. Authentication routes use HTTP-only cookies for JWT storage.

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new agent | No |
| POST | `/signin` | Sign in, returns agent data | No |
| POST | `/signout` | Clear session cookie | No |
| GET | `/me` | Get current session agent | Yes |

### Missions — `/api/missions`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all missions | No |
| GET | `/:id/command` | Get command for a mission | No |
| GET | `/progress` | Get completed mission IDs for agent | Yes |
| POST | `/progress` | Mark a mission as completed | Yes |

### Levels — `/api/levels`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all levels | No |

### Battles — `/api/battles`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | `/complete` | Record a completed battle | Yes |
| GET | `/history` | Get agent battle history | Yes |

### Trophies — `/api/trophies`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all trophies with earned status | Yes |
| POST | `/evaluate` | Evaluate and award newly unlocked trophies | Yes |

### Agents — `/api/agents`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/me` | Get current agent profile | Yes |
| GET | `/leaderboard` | Top 10 agents by XP | No |

### Stats — `/api/stats`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/` | Get agent dossier stats | Yes |

### Arsenal — `/api/arsenal`

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all available collectible items | No |
| GET | `/mine` | Get agent's unlocked items | Yes |
| POST | `/:id/unlock` | Spend coins to unlock an item | Yes |

---

## Game Design

### Levels

| Level | Title | Difficulty | Missions | XP Reward |
|-------|-------|------------|----------|-----------|
| 1 | Recruit Training | Beginner | 10 | 100 |
| 2 | Deep Infiltration | Intermediate | 10 | 200 |
| 3 | Ghost Protocol | Advanced | 10 | 300 |

### Mission Flow

1. Agent reads the **Handler Briefing** (story context)
2. Agent reads **The Command** (what it does + explainer)
3. Agent enters the **Battle** — types the correct Git command
4. On first wrong attempt → hint is revealed, no life lost
5. On subsequent wrong attempts → life deducted
6. On correct answer → coins awarded, trophies evaluated, auto-advances to next mission
7. On level completion → returns to mission map

### Trophy Rarity Tiers

| Rarity | Color | Examples |
|--------|-------|---------|
| Common | Blue | First Strike, Clean Slate, Committed |
| Uncommon | Green | No Hints Required, Streak Operative, Shadow Hunter |
| Rare | Purple | Flawless, Deep Cover, Ghost Protocol |
| Legendary | Gold | Ghost Agent, Perfectionist, Shadow Breach Neutralized |

### Coin Economy

| Action | Coins |
|--------|-------|
| Complete a mission | +10 |
| Unlock a tool | −50 |
| Unlock a boost | −80 |
| Unlock a cosmetic | −30 |

---

## Team

| Name | Role |
|------|------|
| Maria Sicilia | — |
| Bryce Schultz | — |
| Kevin Warner | — |
| Preeti Sagar | — |
| Anas Sallam | — |

---

© 2026 GitQuest · v1.05 · All rights reserved