import express     from 'express';
import requireAuth from '../middleware/auth.js';
import Agent       from '../models/Agent.js';

const router = express.Router();

// GET /api/agents/me — current agent profile
router.get('/me', requireAuth, async (req, res) => {
    try {
        const agent = await Agent.findById(req.agentId).select('-passwordHash');
        res.json({ agent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/agents/leaderboard — top 10 by XP
router.get('/leaderboard', async (_, res) => {
    try {
        const agents = await Agent.find()
            .sort({ totalXP: -1 })
            .limit(10)
            .select('codename totalXP rank streak perfectAttempts avatarUrl');
        res.json({ agents });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;