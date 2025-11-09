import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
dotenv.config();
async function bootstrap() {


  // 🔽 Create the app *without* the simple cors config
  const app = await NestFactory.create(AppModule);

  // 🔽 Add a more powerful, explicit CORS configuration
  app.enableCors({
    origin: "http://localhost:3000", // Allow your Next.js app's origin
    methods: "POST, GET, OPTIONS",   // Allow these methods
    allowedHeaders: "Content-Type, Authorization", // Allow these headers
  });

  const port = process.env.PORT || 3100; // Use the correct port
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();