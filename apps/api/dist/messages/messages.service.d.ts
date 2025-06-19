import { Repository } from 'typeorm';
import { Message } from './entities/messages.entity';
export declare class MessagesService {
    private messageRepository;
    private readonly logger;
    private readonly isDebugEnabled;
    constructor(messageRepository: Repository<Message>);
    findAll(phone?: string): Promise<Message[]>;
    findOne(id: string): Promise<Message | null>;
    create(message: Message): Promise<Message>;
}
