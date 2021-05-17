import NextAuth from "next-auth";
import Providers from "next-auth/providers";
//import Adapters from "next-auth/adapters";

import { NextApiHandler } from "next";
//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scopes: ['activity:read_all'],
      redirectURI: 'http://localhost:3000/redirect',
    }),
    Providers.Strava({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
    }),
    {
      id: "customProvider",
      name: "customProvider",
      type: "oauth",
      version: "2.0",
      scope: "activity:read_all",
      headers: { 
        response_type: "code",
        redirect_uri: "http://localhost:3000/api/auth",
        approval_prompt: "force",
      },
      response_type: "code",
      accessTokenUrl: "https://strava.com/oauth/token",
      authorizationUrl: "https://strava.com/oauth/authorize",
      profileUrl: "https://www.strava.com/api/v3/athlete",
      async profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          image: profile.profile
        }
      },
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
    },
    Providers.Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
    }),
  ],
  // @ts-ignore
//  adapter: Adapters.Prisma.Adapter({
//    prisma,
//  }),

  secret: process.env.SECRET,
};
