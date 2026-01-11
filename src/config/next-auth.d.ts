import { JWT, User } from "next-auth";
// see module augmentation https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// for how to augment existing typescript types (in this case we're augment the JWT interface)

// In actions.ts we use session.user.id from next-auth, but session.user does not typically make
// the user ID visible, we had to add it explicitly in the session callback in auth.ts
// So we need to augment the next-auth interface with an id field to stop typescript errors
declare module "next-auth" {
    interface Session {
        user: User & {
            id: string;
        }
    }
}

// if you follow the definition files from 'token' in auth.ts you will eventually find its typed as
// JWT. If you got to the JWT definition you'll find it's under 
// node_modules > auth > core > src > jwt.ts which translates to module path @auth/core/jwt
// and then we just add userId to the existing JWT interface
declare module "@auth/core/jwt" {
    interface JWT {
        userId: string;
    }
}