import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { disconnectDatabase } from "./database/client.js";

const env = loadEnv();
const app = await buildApp(env);

const close = async (signal: string): Promise<void> => {
  app.log.info({ signal }, "Shutting down");
  await app.close();
  await disconnectDatabase();
  process.exit(0);
};

process.once("SIGINT", () => void close("SIGINT"));
process.once("SIGTERM", () => void close("SIGTERM"));

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (error) {
  app.log.error(error);
  await disconnectDatabase();
  process.exit(1);
}
