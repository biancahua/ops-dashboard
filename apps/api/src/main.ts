import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './datasource';
import { Message } from './messages/entities/messages.entity';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as readline from 'readline';
import * as fs from 'fs';

interface MessageData {
  content?: string;
  sender_type?: string;
  phone?: string | number;
  reason?: string;
  job_type?: string;
  urgency?: number;
  outcome?: string;
  operator_id?: string;
  status?: string;
  actions?: Array<{
    type?: string;
    result?: string;
    error?: string | null;
  }>;
}

async function processJsonlFile(
  filePath: string,
  messageRepo: Repository<Message>,
) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const data = JSON.parse(line) as MessageData;

      const message = messageRepo.create({
        content: data.content ?? null,
        sender_type: data.sender_type ?? null,
        phone: Number(data.phone),
        reason: data.reason ?? null,
        job_type: data.job_type ?? null,
        outcome: data.outcome ?? null,
        operator_id: data.operator_id ?? null,
        urgency: data.urgency ?? null,
        status: data.status ?? null,
        actions: data.actions ?? [],
      });

      await messageRepo.save(message);
    } catch (err) {
      console.error(`Error parsing line in ${filePath}:`, err);
    }
  }
}

async function walkAndLoad(dir: string, messageRepo: Repository<Message>) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walkAndLoad(fullPath, messageRepo); // recurse into folders
    } else if (entry.name.endsWith('.jsonl')) {
      await processJsonlFile(fullPath, messageRepo);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppDataSource.initialize();
  const messageRepo = AppDataSource.getRepository(Message);

  const baseConversationsPath = path.join(__dirname, '../conversations');
  const callsPath = path.join(baseConversationsPath, 'calls');
  const textsPath = path.join(baseConversationsPath, 'texts');

  console.log('Loading calls...');
  await walkAndLoad(callsPath, messageRepo);

  console.log('Loading texts...');
  await walkAndLoad(textsPath, messageRepo);

  console.log('✅ Messages table seeded from both calls and texts.');
  await app.listen(process.env.PORT ?? 3002).then(() => {
    console.log(`Server is running on port ${process.env.PORT ?? 3002}`);
  });
}
bootstrap();
