import NextAuth from "next-auth";
import { nextAuthOptions } from "@src/lib/nextAuthOptions";

const { handlers } = NextAuth(nextAuthOptions);

export const { GET, POST } = handlers;

