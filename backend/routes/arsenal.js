import express       from 'express';
import requireAuth   from '../middleware/auth.js';
import Arsenal       from '../models/Arsenal.js';
import AgentArsenal  from '../models/AgentArsenal.js';
import Agent         from '../models/Agent.js';

const router = express.Router();

// GET /api/arsenal — all available items
router.get('/', async (_, res) => {
    try {
        const items = await Arsenal.find({ isAvailable: true }).sort({ coinCost: 1 });
        res.json({ items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/arsenal/mine — items the agent has unlocked
router.get('/mine', requireAuth, async (req, res) => {
    try {
        const unlocked = await AgentArsenal.find({ agentId: req.agentId })
            .populate('arsenalId');
        res.json({ unlocked });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/arsenal/:id/unlock — spend coins to unlock an item
router.post('/:id/unlock', requireAuth, async (req, res) => {
    try {
        const item  = await Arsenal.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const agent = await Agent.findById(req.agentId);
        if (agent.coins < item.coinCost)
            return res.status(400).json({ error: 'Not enough coins' });

        const already = await AgentArsenal.findOne({
            agentId: req.agentId, arsenalId: item._id
        });
        if (already)
            return res.status(409).json({ error: 'Item already unlocked' });

        await AgentArsenal.create({ agentId: req.agentId, arsenalId: item._id });
        await Agent.findByIdAndUpdate(req.agentId, { $inc: { coins: -item.coinCost } });

        res.json({ message: `${item.name} unlocked successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;