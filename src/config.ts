import * as dotenv from "dotenv";
import * as path from "path";

// This finds the .env file in your root folder (one level up from 'src')
const envPath = path.join(__dirname, '..', '.env');

// Load the .env file
dotenv.config({ path: envPath });

// 🔽🔽🔽 DEBUGGING LINES 🔽🔽🔽
// We MUST see these lines when the server starts.
console.log(`--- [config.ts] Loading .env from: ${envPath} ---`);
console.log(`--- [config.ts] PROJECT_ID loaded: ${process.env.FIREBASE_PROJECT_ID} ---`);