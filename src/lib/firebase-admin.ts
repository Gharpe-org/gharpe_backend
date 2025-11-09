import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from root
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = admin.auth();
