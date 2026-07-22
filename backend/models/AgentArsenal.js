import mongoose from 'mongoose';

const agentArsenalSchema = new mongoose.Schema({
    agentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Agent',   required: true },
    arsenalId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Arsenal', required: true },
    unlockedAt: { type: Date, default: Date.now },
}, { timestamps: true });

agentArsenalSchema.index({ agentId: 1, arsenalId: 1 }, { unique: true });

export default mongoose.model('AgentArsenal', agentArsenalSchema);