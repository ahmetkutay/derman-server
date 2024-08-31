import Reply,{IReply} from "../model/replyModel";

export async function createReply(commentData: Partial<IReply>): Promise<IReply> {
    const comment = new Reply(commentData);
    return await comment.save();
}

export async function updateReply(id: string, commentData: Partial<IReply>): Promise<IReply | null> {
    return Reply.findByIdAndUpdate(id, commentData, {new: true});
}

export async function deleteReply(id: string): Promise<IReply | null> {
    return Reply.findByIdAndDelete(id).exec();
}