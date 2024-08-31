import mongoose, { Schema, Document,Types } from 'mongoose';
import User from './userModel';
import Comment from "./commentModel";

export interface IReply extends Document {
    commentedId: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReplySchema: Schema = new Schema<IReply>({
    commentedId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Comment' },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

ReplySchema.post('save', async function (doc: IReply) {
    try {
        await Comment.findByIdAndUpdate(doc.commentedId, {
            $push: { replies: doc._id }
        });
        await User.findByIdAndUpdate(doc.author, {
            $push: { comments: doc._id }
        });
        console.log('Tweet and User updated with new comment.');
    } catch (error) {
        console.error('Error updating tweet and user with new comment:', error);
    }
});

ReplySchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
    try {
        const query = this as any;
        const comment = await query.model.findOne(query.getQuery()).exec();
        if (comment) {
            await Comment.findByIdAndUpdate(comment.commentId, {
                $pull: { replies: comment._id }
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


const ReplyModel = mongoose.model<IReply>('Reply', ReplySchema);

export default ReplyModel;