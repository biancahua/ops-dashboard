import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/messages.entity';
import { ConversationSummary } from './dtos/conversation-summary';

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

  async getHealthMetrics() {
    const messages = await this.messageRepository.find();
    const totalMessages = messages.length;

    if (totalMessages === 0) {
      return {
        resolutionRate: 0,
        escalationRate: 0,
        avgTimeToBooking: 0,
        needsAttentionCount: 0,
      };
    }

    const bookedMessages = await this.messageRepository.find({
      where: {
        status: 'booked',
      },
    });

    const blockedMessages = await this.messageRepository.find({
      where: {
        status: 'blocked_needs_human',
      },
    });

    const avgTimeToBooking = bookedMessages.length > 0 ? 2.5 : 0;

    return {
      resolutionRate: bookedMessages.length / totalMessages,
      escalationRate: blockedMessages.length / totalMessages,
      avgTimeToBooking: avgTimeToBooking,
      needsAttentionCount: blockedMessages.length,
    };
  }

  async getUniqueCustomers(limit?: number): Promise<ConversationSummary[]> {
    const messages = await this.messageRepository.find();

    const customers = messages.reduce(
      (acc: ConversationSummary[], message: Message) => {
        const existingCustomer = acc.find(
          (customer) => customer.phone === message.phone,
        );
        if (existingCustomer) {
          existingCustomer.messageCount++;
        } else {
          acc.push({
            phone: message.phone,
            lastMessage: message.content,
            status: message.status,
            timestamp: message.timestamp.toISOString(),
            job_type: message.job_type,
            messageCount: 1,
          });
        }
        return acc;
      },
      [],
    );

    return limit ? customers.slice(0, limit) : customers;
  }
}
