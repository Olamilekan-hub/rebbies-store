import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { commonValidations, sanitizeInput } from "@/utils/validation";
import { handleApiError, AppError } from "@/utils/errorHandler";
import { z } from "zod";

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: commonValidations.password,
});

export const POST = async (request: Request) => {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get("x-forwarded-for") ||
                    request.headers.get("x-real-ip") ||
                    "unknown";

    // Check rate limit - only 5 attempts per 15 minutes for password reset
    if (!commonValidations.checkRateLimit(clientIP, 5, 15 * 60 * 1000)) {
      throw new AppError("Too many password reset attempts. Please try again later.", 429);
    }

    const body = await sanitizeInput.validateJsonInput(request);

    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      throw validationResult.error;
    }

    const { token, password } = validationResult.data;

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token. Please request a new password reset.", 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 14);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Return success response
    return new NextResponse(
      JSON.stringify({
        message: "Password reset successful"
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