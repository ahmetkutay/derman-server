import Message , {IMessage} from '../model/chatModel';

export async function getMessages(senderId: string,recieverId:string): Promise<IMessage | null> {
    return Message.findById({senderId,recieverId});
}

export async function createMessage(messageData: Partial<IMessage>): Promise<IMessage> {
    const message = new Message(messageData);
    return await message.save();
}

export async function updatePost(id: string, postData: Partial<IMessage>): Promise<IMessage | null> {
    return Message.findByIdAndUpdate(id, postData, {new: true});
}

export async function deletePost(id: string): Promise<IMessage | null> {
    return Message.findByIdAndDelete(id).exec();
}
