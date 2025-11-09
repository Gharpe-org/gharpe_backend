import { Injectable } from "@nestjs/common";
import { adminAuth } from "../lib/firebase-admin";

@Injectable()
export class AuthService {
  async verifyToken(token: string) {
    try {
      // 🔽 CHANGED: Use the 'adminAuth' export
      const decodedToken = await adminAuth.verifyIdToken(token);
      return {
        success: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
     };
    } catch (error) {
      console.error("Error verifying token:", error); // Good to log the error
    return { success: false, message: "Invalid or expired token" };
 }
  }
}