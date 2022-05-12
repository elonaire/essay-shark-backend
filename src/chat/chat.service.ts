import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY, MESSAGE_REPOSITORY, USER_CHAT_REPOSITORY } from 'src/constants';
import { Chat, Message, UserChat } from './chat.entity';
import { v4 as uuidGenerator } from 'uuid';

@Injectable()
export class ChatService {
    constructor(
        @Inject(CHAT_REPOSITORY) private readonly chatRepository: typeof Chat,
        @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: typeof Message,
        @Inject(USER_CHAT_REPOSITORY) private readonly userChatRepository: typeof UserChat,
    ) {}

    createChat(chat: Chat): void {
        console.log('chat', chat);
        
        // return await this.chatRepository.create(chat);
    }
}
