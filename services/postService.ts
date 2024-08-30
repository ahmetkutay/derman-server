import Tweet, {ITweet} from '../model/postModel';

export async function getAllPosts(): Promise<ITweet[]> {
    return Tweet.find();
}

export async function getPostById(id: string): Promise<ITweet | null> {
    return Tweet.findById(id);
}

export async function createPost(postData: Partial<ITweet>): Promise<ITweet> {
    const post = new Tweet(postData);
    return await post.save();
}

export async function updatePost(id: string, postData: Partial<ITweet>): Promise<ITweet | null> {
    return Tweet.findByIdAndUpdate(id, postData, {new: true});
}

export async function deletePost(id: string): Promise<ITweet | null> {
    return Tweet.findByIdAndDelete(id).exec();
}
