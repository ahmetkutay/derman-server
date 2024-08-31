import mongoose, { Document, Schema, Types } from 'mongoose';
import User from './userModel';
import Tweet from './postModel';

export interface IComment extends Document {
    text: string;
    author: Types.ObjectId;
    tweet: Types.ObjectId;
    parentComment?: Types.ObjectId;
    createdAt: Date;
    likes: Types.ObjectId[];
    replies: Types.ObjectId[];
}

const CommentSchema: Schema = new Schema({
    text: { type: String, required: true, maxlength: 280 },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    tweet: { type: Types.ObjectId, ref: 'Tweet', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    replies: [{ type: Types.ObjectId, ref: 'Reply' }]
});

CommentSchema.post('save', async function (doc: IComment) {
    try {
        await Comment.findByIdAndUpdate(doc.tweet.toHexString(), {
            $push: { reply: doc._id }
        });
        await User.findByIdAndUpdate(doc.author, {
            $push: { comments: doc._id }
        });
        console.log('Tweet and User updated with new comment.');
    } catch (error) {
        console.error('Error updating tweet and user with new comment:', error);
    }
});

CommentSchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
    try {
        const query = this as any;
        const comment = await query.model.findOne(query.getQuery()).exec();
        if (comment) {
            await Tweet.findByIdAndUpdate(comment.tweet, {
                $pull: { comment: comment._id }
            });
            await User.findByIdAndUpdate(comment.author, {
                $pull: { comments: comment._id }
            });
            console.log('Comment reference removed from tweet and user.');
        }
        next();
    } catch (error) {
        console.error('Error removing comment reference from tweet and user:', error);
        next(error as any);
    }
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;