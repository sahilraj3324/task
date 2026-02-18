import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        userId: {
            type: String,
            required: true, // Required now; swap for JWT sub when auth is added
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // adds createdAt + updatedAt automatically
);

// One answer per user per task — enables efficient upsert
AnswerSchema.index({ task: 1, userId: 1 }, { unique: true });

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
