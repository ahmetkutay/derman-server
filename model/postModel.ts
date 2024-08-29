import mongoose, {Document, Schema} from 'mongoose';

export interface ITweet extends Document {
    text: string;
    author: string;
    category: string;
    createdAt: Date;
    likes: number;
    retweets: number;
}

const TweetSchema: Schema = new Schema({
    text: {type: String, required: true, maxlength: 280},
    author: {type: String, required: true},
    category: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likes: {type: Number, default: 0},
    retweets: {type: Number, default: 0},
});

const Tweet = mongoose.model<ITweet>('Tweet', TweetSchema);

export default Tweet;