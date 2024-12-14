import mongoose from "mongoose";


const labActivitySchema = new mongoose.Schema({
    lab_id: { type: String, required: true, ref: 'Lab' },
    activity_name: { type: String, required: true },
    activity_type: { type: String, enum: ['Research', 'Publication', 'Training', 'Final Project'], default: 'Fair', required: true },
    user: {
        user_nim_nip: { type: String, required: true },
        user_name: { type: String, required: true },
        participant_count: { type: Number, required: true, default: 1 }
    },
    start_time: { type: Date, required: true, default: Date.now }, 
    end_time: { type: Date, required: true },
    equipment_used: [{
        equipment_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Equipment' },
        condition_after_use: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'], default: 'Fair', required: true },
    }],
}, { collection: 'lab_activity'});

export const LabActivity = mongoose.model('LabActivity', labActivitySchema);
