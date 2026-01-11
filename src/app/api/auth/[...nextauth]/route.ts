// browsers don't allow client code to directly access cookie information, for security reasons
// to use useSession on the client to get session information it needs to make GET and POST 
// requests to endpoint /api/auth/session, they're provided by NextAuth in auth.js but we need to export
// it in a route.js files to create the endpoint
export { GET, POST } from "@/config/auth";