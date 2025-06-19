import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Message } from './messages/entities/messages.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  entities: [Message],
});
