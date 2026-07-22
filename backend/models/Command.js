import mongoose from 'mongoose';

const commandSchema = new mongoose.Schema({
    missionId:                { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    command:                  { type: String, required: true },
    validPattern:             { type: String, required: true },
    caseSensitive:            { type: Boolean, default: true },
    hint:                     { type: String, required: true },
    hintUnlocksAfterAttempts: { type: Number, default: 1 },
    explainer:                { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Command', commandSchema);