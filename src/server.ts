import { buildApp } from "./buildApp";
import { logger } from "./logger";

const run = async () => {
  const app = buildApp();

  const port = process.env.PORT || 7700;

  try {
    const address = await app.listen({ port: Number(port), host: "0.0.0.0" });
    logger.info(`Application port = ${port}`);
    logger.info("Server running: " + address);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
