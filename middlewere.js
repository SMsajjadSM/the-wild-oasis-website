import { auth } from "./app/_lib/auth";





export const middlewere = auth;
export const config = { matcher: ["/account"] };
