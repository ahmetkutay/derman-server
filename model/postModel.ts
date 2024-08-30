import mongoose, { Document, Schema, Types } from 'mongoose';
import User from "./userModel";

export interface ITweet extends Document {
    text: string;
    author: Types.ObjectId;
    category: string;
    createdAt: Date;
    likes: Types.ObjectId[];
    comment: Types.ObjectId[];
}

const TweetSchema: Schema = new Schema({
    text: { type: String, required: true, maxlength: 280 },
    author: { type: Types.ObjectId, ref:'User', required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Types.ObjectId, ref: 'User' }],
    comment: [{ type: Types.ObjectId, ref: 'User' }]
});

TweetSchema.post('save', async function (doc: ITweet) {
    try {
        await User.findByIdAndUpdate(doc.author, {
            $push: { tweets: doc._id }
        });
        console.log('User updated with new tweet.');
    } catch (error) {
        console.error('Error updating user with new tweet:', error);
    }
});

TweetSchema.pre('findOneAndDelete', { document: false, query: true }, async function (next) {
    try {
        const query = this as any;
        const tweet = await query.model.findOne(query.getQuery()).exec();
        if (tweet) {
            await User.findByIdAndUpdate(tweet.author, {
                $pull: { tweets: tweet._id }
            });
            console.log('Tweet reference removed from user.');
        }
        next();
    } catch (error) {
        console.error('Error removing tweet reference from user:', error);
        next(error as any);
    }
});

TweetSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as Partial<ITweet>;

    if (update.author) {
        const oldDoc = await this.model.findOne(this.getQuery()) as ITweet;
        if (oldDoc && oldDoc.author !== update.author) {
            await User.findByIdAndUpdate(oldDoc.author, {
                $pull: { tweets: oldDoc._id }
            });
            await User.findByIdAndUpdate(update.author, {
                $push: { tweets: oldDoc._id }
            });
        }
    }
    next();
});

const Tweet = mongoose.model<ITweet>('Tweet', TweetSchema);

export default Tweet;