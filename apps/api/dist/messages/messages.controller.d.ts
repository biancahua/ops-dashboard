import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    private readonly logger;
    constructor(messagesService: MessagesService);
    getMessages(phone?: string): Promise<import("./entities/messages.entity").Message[]>;
}
