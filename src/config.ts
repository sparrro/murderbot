import dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID, SERVER_ID, MY_ID } = process.env;

if (!TOKEN || !CLIENT_ID || !SERVER_ID || !MY_ID) throw new Error("Missing environment variables");

export { TOKEN, CLIENT_ID, SERVER_ID, MY_ID };