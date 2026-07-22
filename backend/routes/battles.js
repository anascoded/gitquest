import express     from 'express';
import requireAuth from '../middleware/auth.js';
import Battle      from '../models/Battle.js';
import Agent       from '../models/Agent.js';

const router = express.Router();

// POST /api/battles — start a battle
router.post('/', requireAuth, async (req, res) => {
    try {
        const { missionId, commandId } = req.body;
        const battle = await Battle.create({
            agentId: req.agentId, missionId, commandId
        });
        res.status(201).json({ battle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/battles/:id/complete — complete a battle
router.patch('/:id/complete', requireAuth, async (req, res) => {
    try {
        const { attempts, hintUsed, passed, livesRemaining, xpEarned, coinsEarned } = req.body;

        const perfectPass = attempts === 1 && !hintUsed && passed;

        const battle = await Battle.findByIdAndUpdate(req.params.id, {
            attempts, hintUsed, passed, perfectPass,
            livesRemaining, xpEarned, coinsEarned,
            completedAt: new Date(),
        }, { new: true });

        if (passed) {
            await Agent.findByIdAndUpdate(req.agentId, {
                $inc: {
                    totalMissions:   1,
                    totalXP:         xpEarned,
                    coins:           coinsEarned,
                    perfectAttempts: perfectPass ? 1 : 0,
                }
            });
        }

        res.json({ battle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/battles/history — agent's battle history
router.get('/history', requireAuth, async (req, res) => {
    try {
        const battles = await Battle.find({ agentId: req.agentId })
            .populate('missionId', 'title')
            .sort({ startedAt: -1 })
            .limit(20);
        res.json({ battles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;