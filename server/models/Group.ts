import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    albums: [
        {
            title: {
                type: String,
                required: true
            },
            artist: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            ratings: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'User', 
                    required: true
                },
                rating: { 
                    type: Number,
                    required: true
                }
            }],
            dateListened: {
                type: Date,
            }
        }
    ]
});

module.exports = mongoose.model('Group', GroupSchema)
