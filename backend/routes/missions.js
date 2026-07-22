import express  from 'express';
import Mission  from '../models/Mission.js';
import Command  from '../models/Command.js';

const router = express.Router();

// GET /api/missions?levelId=xxx — missions for a level
router.get('/', async (req, res) => {
    try {
        const { levelId } = req.query;
        const filter = levelId ? { levelId } : {};
        const missions = await Mission.find(filter).sort({ order: 1 });
        res.json({ missions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/missions/:id/command — get command for a mission
router.get('/:id/command', async (req, res) => {
    try {
        const command = await Command.findOne({ missionId: req.params.id });
        if (!command) return res.status(404).json({ error: 'Command not found' });
        res.json({ command });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;