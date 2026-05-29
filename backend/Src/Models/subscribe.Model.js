import mongoose from "mongoose";
const subscribeSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

}, { timestamps: true })
export const subscribeModel = mongoose.model("subscribe", subscribeSchema)