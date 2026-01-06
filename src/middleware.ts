// Example middleware that logs the request URL
// import { NextRequest, NextResponse } from 'next/server';
// export function middleware(request: Request) {
//   console.log(request.url);
//   // NextResponse.next() allows the request to proceed
//   return NextResponse.next();
// }

//
// import { auth } from './config/auth';

// export default auth;

export { default } from 'next-auth/middleware';

// config to specify the paths where the middleware should be applied
// here we we exclude (with the !) api routes, next.js static files and the favicon
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

export const config = {
  matcher: ['/app'],
};
