import express  from 'express';
import bcrypt   from 'bcryptjs';
import jwt      from 'jsonwebtoken';
import Agent    from '../models/Agent.js';

const router = express.Router();

// ── Sign Up ───────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
    try {
        const { codename, email, password } = req.body;

        if (!codename || !email || !password)
            return res.status(400).json({ error: 'All fields are required' });

        if (/\s/.test(codename))
            return res.status(400).json({ error: 'Codename cannot contain spaces' });

        if (password.length < 8)
            return res.status(400).json({ error: 'Password must be at least 8 characters' });

        const exists = await Agent.findOne({ $or: [{ email }, { codename }] });
        if (exists)
            return res.status(409).json({ error: 'Codename or email already taken' });

        const passwordHash = await bcrypt.hash(password, 12);
        const agent = await Agent.create({ codename, email, passwordHash });

        const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        });

        res.status(201).json({
            agent: { id: agent._id, codename: agent.codename, email: agent.email }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Sign In ───────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const agent = await Agent.findOne({ email });
        if (!agent)
            return res.status(401).json({ error: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, agent.passwordHash);
        if (!valid)
            return res.status(401).json({ error: 'Invalid email or password' });

        // ── Streak logic ──────────────────────────────────────────
        const today     = new Date();
        const last      = agent.lastActiveDate;
        const oneDay    = 86400000;
        const diffDays  = last ? Math.floor((today - last) / oneDay) : null;

        if      (diffDays === null) agent.streak = 1;
        else if (diffDays === 1)    agent.streak += 1;
        else if (diffDays > 1)      agent.streak = 1;
        // same day → no change

        agent.lastActiveDate = today;
        await agent.save();

        const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            agent: {
                id: agent._id, codename: agent.codename,
                email: agent.email, streak: agent.streak,
                coins: agent.coins, rank: agent.rank,
                totalXP: agent.totalXP,
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Sign Out ──────────────────────────────────────────────────
router.post('/signout', (_, res) => {
    res.clearCookie('token');
    res.json({ message: 'Signed out successfully' });
});

// ── Me (get current session) ──────────────────────────────────
router.get('/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const agent   = await Agent.findById(decoded.id).select('-passwordHash');
        if (!agent) return res.status(404).json({ error: 'Agent not found' });
        res.json({ agent });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;