import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    cognitoId: {
        type: String, 
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    usersAlbums: [
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
            rating: {
                type: Number
            },
            dateListened: {
                type: Date,
                default: Date.now
            }
        }
    ],
    usersSavedAlbums: [
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
        }
    ],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});

export const User = mongoose.model('User', UserSchema);
