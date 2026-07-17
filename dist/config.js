"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODROLE_ID = exports.MY_ID = exports.SERVER_ID = exports.CLIENT_ID = exports.TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN, CLIENT_ID, SERVER_ID, MY_ID, MODROLE_ID } = process.env;
exports.TOKEN = TOKEN;
exports.CLIENT_ID = CLIENT_ID;
exports.SERVER_ID = SERVER_ID;
exports.MY_ID = MY_ID;
exports.MODROLE_ID = MODROLE_ID;
if (!TOKEN ||
    !CLIENT_ID ||
    !SERVER_ID ||
    !MY_ID ||
    !MODROLE_ID)
    throw new Error("Missing environment variables");
