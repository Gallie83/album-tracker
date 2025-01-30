import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    private: {
        type: Boolean,
        required: true,
    },
    members: [{ 
        type: String, 
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
            hashId: {
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

export const Group = mongoose.model('Group', GroupSchema)
