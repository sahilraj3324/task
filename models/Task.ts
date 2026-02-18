import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        topic: {
            type: String,
            default: '',
        },
        day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day' },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['not_started', 'started', 'completed'],
            default: 'not_started',
        },
    },
    { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
