const prisma = require("../utills/db");
const bcrypt = require("bcryptjs");
const { asyncHandler, AppError } = require("../utills/errorHandler");

// Helper function to exclude password from user object
function excludePassword(user) {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  // Basic validation
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  try {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401);
    }

    // Return user data without password
    return response.status(200).json(excludePassword(user));
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    console.error('Login error:', err);
    throw new AppError("Authentication failed", 500);
  }
});

const validateToken = asyncHandler(async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return response.status(200).json(excludePassword(user));
});

module.exports = {
  loginUser,
  validateToken,
};
