import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    birthdate: string;
    gender: string;
    verified: boolean;
    verificationToken: string;
    refreshToken: string;
    tweets: Types.ObjectId[];
    messages: Types.ObjectId[];
    comments: Types.ObjectId[];
    followers: Types.ObjectId[];
    followed: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    birthdate: { type: String, required: true },
    gender: { type: String, required: true },
    verified: { type: "Boolean", required: false, default: false },
    verificationToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
    tweets: [{ type: Types.ObjectId, ref: 'Tweet' }],
    messages: [{ type: Types.ObjectId, ref: 'Message' }],
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    followers: [{ type: Types.ObjectId, ref: 'Comment' }],
    followed: [{ type: Types.ObjectId, ref: 'Comment' }]
});

const User = model<IUser>('User', UserSchema);

export default User;
