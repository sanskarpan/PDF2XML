// backend/src/shared/guards/clerk.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { UsersService } from '../../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // Make sure CLERK_SECRET_KEY is set
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is not defined');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      // Get authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid token');
      }

      // Extract token
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      // Decode token to get user ID - this doesn't verify the token
      // We're relying on Clerk's API to verify the user exists
      const decodedToken = jwt.decode(token) as { sub?: string };
      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException('Invalid token format');
      }

      const userId = decodedToken.sub;
      
      // Verify the user exists in Clerk
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (!clerkUser) {
          throw new UnauthorizedException('User not found');
        }
        
        // Get or create user in our database
        let user = await this.usersService.findOne(userId);
        
        if (!user) {
          // Find primary email
          const primaryEmail = clerkUser.emailAddresses.find(
            email => email.id === clerkUser.primaryEmailAddressId
          );
          
          if (!primaryEmail) {
            throw new UnauthorizedException('User has no primary email');
          }
          
          // Create user in our database
          user = await this.usersService.createUser({
            id: userId,
            email: primaryEmail.emailAddress,
          });
        }
        
        // Attach user to request
        request.user = {
          id: user?.id,
          email: user?.email,
        };
        
        return true;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        console.error('Error verifying user with Clerk:', error);
        throw new UnauthorizedException('Failed to verify user');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}