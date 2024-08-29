import mongoose, {Document, Schema, Types} from 'mongoose';

export interface ITweet extends Document {
    text: string;
    author: string;
    category: string;
    createdAt: Date;
    likes: Types.ObjectId[];
    retweets: Types.ObjectId[];
}

const TweetSchema: Schema = new Schema({
    text: {type: String, required: true, maxlength: 280},
    author: {type: String, required: true},
    category: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: [{ type: Types.ObjectId, ref: 'Likes' }],
    retweets: [{ type: Types.ObjectId, ref: 'Retweets' }]
});

const Tweet = mongoose.model<ITweet>('Tweet', TweetSchema);

export default Tweet;