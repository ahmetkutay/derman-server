import {Schema, model, Document, Types} from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Types.ObjectId[];
    messages: Types.ObjectId[];
    comments: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    posts: [{type: Types.ObjectId, ref: 'Post'}],
    messages: [{type: Types.ObjectId, ref: 'Message'}],
    comments: [{type: Types.ObjectId, ref: 'Comment'}]
});

const User = model<IUser>('User', UserSchema);

export default User;