"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const datasource_1 = require("./datasource");
const messages_entity_1 = require("./messages/entities/messages.entity");
const path = require("path");
const readline = require("readline");
const fs = require("fs");
async function processJsonlFile(filePath, messageRepo) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
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
        }
        catch (err) {
            console.error(`Error parsing line in ${filePath}:`, err);
        }
    }
}
async function walkAndLoad(dir, messageRepo) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walkAndLoad(fullPath, messageRepo);
        }
        else if (entry.name.endsWith('.jsonl')) {
            await processJsonlFile(fullPath, messageRepo);
        }
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await datasource_1.AppDataSource.initialize();
    const messageRepo = datasource_1.AppDataSource.getRepository(messages_entity_1.Message);
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
//# sourceMappingURL=main.js.map