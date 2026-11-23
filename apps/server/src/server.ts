import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

async function bootstrap() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`LYRA API: http://localhost:${env.PORT}`);
    });

    const shutdown = async () => {
      console.log("LYRA shutting down");
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => void shutdown());
    process.on("SIGINT", () => void shutdown());
  } catch (error) {
    console.error("LYRA startup failed:", error);
    process.exit(1);
  }
}

void bootstrap();
