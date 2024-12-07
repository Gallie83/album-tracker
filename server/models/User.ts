import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    password: {
        type: String, 
        required: true
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
    userSavedAlbums: [
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

module.exports = mongoose.model('User', UserSchema)
