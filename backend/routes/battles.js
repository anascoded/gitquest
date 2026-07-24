import express     from 'express';
import requireAuth from '../middleware/auth.js';
import Battle      from '../models/Battle.js';
import Agent       from '../models/Agent.js';

const router = express.Router();

// POST /api/battles/complete — record a completed battle
router.post('/complete', requireAuth, async (req, res) => {
    try {
        const {
            missionId,
            commandId,
            attempts,
            hintUsed,
            passed,
            xpEarned,
            coinsEarned,
        } = req.body;

        const perfectPass = attempts === 1 && !hintUsed && passed;

        // Upsert — one battle record per agent per mission
        const battle = await Battle.findOneAndUpdate(
            { agentId: req.agentId, missionId },
            {
                agentId: req.agentId,
                missionId,
                commandId,
                attempts,
                hintUsed,
                passed,
                perfectPass,
                xpEarned,
                coinsEarned,
                completedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Update agent totals
        if (passed) {
            await Agent.findByIdAndUpdate(req.agentId, {
                $inc: {
                    totalXP:    xpEarned   ?? 0,
                    coins:      coinsEarned ?? 0,
                    totalMissions: 1,
                    ...(perfectPass ? { perfectAttempts: 1 } : {}),
                }
            });
        }

        res.json({ battle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/battles/history — agent battle history
router.get('/history', requireAuth, async (req, res) => {
    try {
        const battles = await Battle.find({ agentId: req.agentId })
            .populate('missionId', 'title')
            .sort({ completedAt: -1 })
            .limit(20);
        res.json({ battles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;