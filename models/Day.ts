import mongoose from 'mongoose';

const DaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        unique: true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

export default mongoose.models.Day || mongoose.model('Day', DaySchema);
