import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/messages.entity';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  private readonly isDebugEnabled = process.env.LOG_LEVEL === 'debug';

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  findAll(phone?: string) {
    if (phone) {
      return this.messageRepository.find({
        where: { phone: Number(phone) },
        order: { id: 'ASC' },
      });
    }
    return this.messageRepository.find();
  }

  findOne(id: string) {
    return this.messageRepository.findOne({ where: { id } });
  }

  create(message: Message) {
    return this.messageRepository.save(message);
  }
}
