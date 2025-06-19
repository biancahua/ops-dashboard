import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Query('phone') phone?: string) {
    return this.messagesService.findAll(phone);
  }
}
