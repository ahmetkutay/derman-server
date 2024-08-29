import Tweet, {ITweet} from '../model/postModel';

async function getAllPosts(): Promise<ITweet[]> {
    return Tweet.find();
}

async function getPostById(id: string): Promise<ITweet | null> {
    return Tweet.findById(id);
}

async function createPost(postData: Partial<ITweet>): Promise<ITweet> {
    const post = new Tweet(postData);
    return await post.save();
}

async function updatePost(id: string, postData: Partial<ITweet>): Promise<ITweet | null> {
    return Tweet.findByIdAndUpdate(id, postData, {new: true});
}

async function deletePost(id: string): Promise<ITweet | null> {
    return Tweet.findByIdAndDelete(id);
}

export default {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};