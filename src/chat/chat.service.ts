import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY, MESSAGE_REPOSITORY, USER_CHAT_REPOSITORY } from 'src/constants';
import { Chat, Message, UserChat } from './chat.entity';
import { v4 as uuidGenerator } from 'uuid';
import { User, UserDto } from 'src/users/user.entity';

export interface ChatInfo {
    user: UserDto;
    message: string;
    chatId: string;
}

@Injectable()
export class ChatService {
    constructor(
        @Inject(CHAT_REPOSITORY) private readonly chatRepository: typeof Chat,
        @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: typeof Message,
        @Inject(USER_CHAT_REPOSITORY) private readonly userChatRepository: typeof UserChat,
    ) {}

    async createChat(chat: ChatInfo): Promise<Chat> {
        console.log('chat', chat);
        let chatCreated: Chat;
        if (!chat.chatId) {
            chatCreated = await this.chatRepository.create({
                chatId: uuidGenerator(),
            });
        } else {
            chatCreated = await this.chatRepository.findOne({ where: { chatId: chat.chatId } });
        }

        if (!chatCreated) {
            throw new HttpException('Chat not created', 400);
        }

        await chatCreated.$add('users', chat.user.user_id);
        
        const messageId = uuidGenerator();
        await this.messageRepository.create({
            messageId,
            chatId: chatCreated.chatId,
            user_id: chat.user.user_id,
            message: chat.message,
        });
        return await this.getChat(chatCreated.chatId); 
    }

    async getChat(chatId: string): Promise<Chat> {
        return await this.chatRepository.findOne({ where: { chatId }, include: [{model: Message, as: 'messages'}, {model: User, as: 'users'}] });
    }
}
