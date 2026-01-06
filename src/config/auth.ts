import NextAuth, { AuthOptions } from 'next-auth';

// NextAuth configuration
// the jwt config is the default so could be removed below, but its left explicit for clarity
const config = {
  pages: {
    signIn: '/login',
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [],
  callbacks: {},
} satisfies AuthOptions;

export const { auth } = NextAuth(config);
