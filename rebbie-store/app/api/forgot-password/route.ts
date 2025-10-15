import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import { commonValidations, sanitizeInput } from "@/utils/validation";
import { handleApiError, AppError } from "@/utils/errorHandler";
import { nanoid } from "nanoid";
import { z } from "zod";
import emailService from "@/lib/emailService";

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: commonValidations.email,
});

export const POST = async (request: Request) => {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get("x-forwarded-for") ||
                    request.headers.get("x-real-ip") ||
                    "unknown";

    // Check rate limit - only 3 attempts per 15 minutes for forgot password
    if (!commonValidations.checkRateLimit(clientIP, 3, 15 * 60 * 1000)) {
      throw new AppError("Too many password reset attempts. Please try again later.", 429);
    }

    const body = await sanitizeInput.validateJsonInput(request);

    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      throw validationResult.error;
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      // For security, we don't reveal if email exists or not
      // Return success message regardless
      return new NextResponse(
        JSON.stringify({
          message: "If an account with that email exists, we've sent password reset instructions."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Generate password reset token
    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the reset token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Generate reset link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail({
      to: email,
      name: user.name || undefined,
      resetLink: resetLink,
      expiryTime: 15, // 15 minutes
    });

    if (!emailSent) {
      console.error('Failed to send password reset email to:', email);
      // We still return success for security reasons, but log the error
    }

    console.log(`Password reset email sent to: ${email}`);

    return new NextResponse(
      JSON.stringify({
        message: "If an account with that email exists, we've sent password reset instructions."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return handleApiError(error);
  }
};