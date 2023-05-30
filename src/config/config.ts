interface Config {
  baseurl: string;
  secretJwt: string;
  clientId: string;
  clientSecret: string;
  nextAuthSecret: string;
}

export const config: Config = {
  baseurl: process.env.NEXT_PUBLIC_BASE_URL || "",
  secretJwt: process.env.SECRET_JWT || "",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
};
