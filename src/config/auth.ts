import { getUserByEmail } from '@/lib/server-utils';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authSchema } from '@/lib/validations';

// NextAuth configuration
// the session config is the default so could be removed below, but its left explicit for clarity
// next-auth has its own signIn page but we override it with /login
const config = {
  pages: {
    // next-auth provide signIn, SignOut and other pages like an error page
    // to use custom pages provides the URLs here
    signIn: '/login',
  },
  session: {
    maxAge: 60 * 60 * 24 * 30, // jwt token valid for 30 days
    strategy: 'jwt', // the altermative is 'database'
  },
  providers: [
    // the Credentials provider is for signing in with username and password
    // OAuth (e.g. Google) and email (send an email to authentiacate) are also supported
    Credentials({
      async authorize(credentials) {
        // runs on login, whatever you pass to the signIn function in actions.ts>logIn is what's passed to authorise
        
        // validate the schema of the object with the zod schema we created
        const validatedCredentials = authSchema.safeParse(credentials);
        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;

        // At the time of dev this prisma call appears to be causing this error
        // Module build failed: UnhandledSchemeError: Reading from "node:crypto" is not handled by plugins (Unhandled scheme).
        // referenced here but no obvious fix https://github.com/prisma/prisma/issues/27341
        // could revert to prisma 5.8.1 which doesn't require the adapter in lib>db.ts
        // see https://github.com/ByteGrad/Professional-React-and-Next.js-Course/blob/final/petsoft/final-code/src/lib/db.ts
        // However hard coding user credentials for now
        // TODO come back and troubleshoot more, restore prisma credentials
        //
        // const user = await getUserByEmail(email);
        //
        // user example@gmail.com password example
        // user test@gmail.com password test
        const users = [
          {
            id: 'cmk1lacxi0000btuej42r492k',  
            email: 'example@gmail.com',
            hashedPassword: '$2b$10$nqa/gVqLo.CtImkA8GgF3uLHE5l.OBAk36E6dbjnaofKKTVGKQekS',
          },
          {
            id: 'cmk8d97nr0000z9tjxfq65w25',  
            email: 'test@gmail.com',
            hashedPassword: '$2b$10$dGDoNQaR5zIT81Eo4PVYLuDhjHo/6foIZ1C3PxKA7XYcWYz8lqaom',
          },
        ];

        const user = users.find((user) => { 
          if (user.email === email){
            return user
          };
          return null;
        });

        if (!user) {
          console.log("No user found")
          return null;
        };

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordsMatch) {
          console.log("Invalid credentials")
          return null;
        };

        return user;
      },
    })
  ],
  callbacks: {
    authorized: ({auth, request}) => {
      // runs on every request with middleware
      // auth includes what is returned from the providers above when logging in
      // if the succesfully logs in there will be a user, if not it will be null
      const isLoggedIn = Boolean(auth?.user)
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app')
      
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      } 
      
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      } 
      
      if (isLoggedIn && !isTryingToAccessApp) {
        // redirect requires an absolute URL
        return Response.redirect(new URL('/app/dashboard', request.nextUrl));
      } 
      
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      } 
      
      return false;
    },
    jwt: ({token, user}) => {
      // this is invoked when jwt token is created
      
      if (user) {
        // will get a user on sign in only so have to check if it exists
        // the token only hold email and name fields by default, but we want to add the user ID
        // so we can use it to filter pets. Two important notes 
        // 1. The token is encrypted so we have to add the session callback below to make the ID 
        //    visible to the client
        // 2. if you follow the definitions of token it is typed as JWT which takes an object of 
        //    specific string (user, email ...) but not userID, so when we add userID it gets the type
        //    unknown which later causes typescript errors when you try assign a string to it
        //    so we created a next-auth.d.ts file, a d.ts declaration file get loaded whenever you 
        //    import a module of the same name without the js/ts/d.ts extension,
        //    so in this case we created a next-auth.d.ts in the same directory as this file
        token.userId = user.id!;
      }

      return token;
    },
    session: ({session, token}) => {
      // need to explicitly expose the data we want to be available unencrypted on the client
      // the token itself is encrypted
      session.user.id = token.userId;

      return session;
    }
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: {GET, POST} } = NextAuth(config);
