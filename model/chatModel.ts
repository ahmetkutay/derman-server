import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Date;
}

const messageSchema: Schema = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;