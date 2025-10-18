const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

