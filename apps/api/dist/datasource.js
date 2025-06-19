"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const messages_entity_1 = require("./messages/entities/messages.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    entities: [messages_entity_1.Message],
});
//# sourceMappingURL=datasource.js.map