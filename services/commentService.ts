import Comment , {IComment} from '../model/commentModel';

export async function getCommentById(id: string): Promise<IComment | null> {
    return Comment.findById(id);
}

export async function createComment(commentData: Partial<IComment>): Promise<IComment> {
    const comment = new Comment(commentData);
    return await comment.save();
}

export async function updateComment(id: string, commentData: Partial<IComment>): Promise<IComment | null> {
    return Comment.findByIdAndUpdate(id, commentData, {new: true});
}

export async function deleteComment(id: string): Promise<IComment | null> {
    return Comment.findByIdAndDelete(id).exec();
}