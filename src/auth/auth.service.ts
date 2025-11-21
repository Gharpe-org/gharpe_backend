import { Injectable } from "@nestjs/common";
import { adminAuth } from "../lib/firebase-admin";
import { UsersService } from "../modules/users/users.service";
import { UserRole, AuthProvider } from "../modules/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async verifyToken(token: string) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const { uid, email, name, picture, phone_number } = decodedToken;

      console.log("Decoded token:", { uid, email, name, picture, phone_number });

      let user = null;
      let authProvider: AuthProvider;

      // Determine the auth provider based on available information
      if (phone_number) {
        // Phone authentication
        authProvider = AuthProvider.PHONE;
        user = await this.usersService.findByPhoneNumber(phone_number);
      } else if (email) {
        // Check if it's Apple or Google based on provider data
        const providerData = decodedToken.firebase?.sign_in_provider;
        authProvider = providerData === 'apple.com' ? AuthProvider.APPLE : AuthProvider.GOOGLE;
        user = await this.usersService.findByEmail(email);
      } else {
        console.error("No email or phone number in token");
        return { success: false, message: "Invalid token: missing identifier" };
      }

      if (user) {
        // Update firebaseUid if not present
        if (!user.firebaseUid) {
          await this.usersService.update(user.id, { firebaseUid: uid });
        }
        // Update authProvider if not present
        if (!user.authProvider) {
          await this.usersService.update(user.id, { authProvider });
        }
      } else {
        // Create new user
        const userData: any = {
          firebaseUid: uid,
          role: UserRole.CUSTOMER,
          authProvider,
        };

        if (phone_number) {
          userData.phoneNumber = phone_number;
          userData.name = name || 'Phone User';
          userData.email = email || null; // Phone users might not have email
        } else {
          userData.email = email;
          userData.name = name || email?.split('@')[0] || 'Unknown User';
        }

        if (picture) {
          userData.image = picture;
        }

        user = await this.usersService.create(userData);
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Error verifying token:", error);
      return { success: false, message: "Invalid or expired token" };
    }
  }
}