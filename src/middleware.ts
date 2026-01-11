// Example middleware that logs the request URL
// import { NextRequest, NextResponse } from 'next/server';
// export function middleware(request: Request) {
//   console.log(request.url);
//   // NextResponse.next() allows the request to proceed
//   return NextResponse.next();
// }

import { auth } from './config/auth';

// middleware.ts must either have a function called middleware or export
// a default function, here we export the auth function 
export default auth;

// config to specify the paths where the middleware should be applied
// here, with the ?! which is a negative look ahead assertion 
// meaning not followed by, we exclude: 
// api routes, static files, images and the favicon
// and include everything else, so auth will be invoked on everything else
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
