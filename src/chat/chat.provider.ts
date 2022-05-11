import { CHAT_REPOSITORY, MESSAGE_REPOSITORY, USER_CHAT_REPOSITORY } from "src/constants";
import { Chat, Message, UserChat } from "./chat.entity";

export const chatProviders = [
    {
        provide: CHAT_REPOSITORY,
        useValue: Chat,
    },
    {
        provide: MESSAGE_REPOSITORY,
        useValue: Message,
    },
    {
        provide: USER_CHAT_REPOSITORY,
        useValue: UserChat,
    }
]