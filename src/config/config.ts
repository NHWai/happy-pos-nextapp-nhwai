interface Config {
  baseurl: string;
  secretJwt: string;
  clientId: string;
  clientSecret: string;
  nextAuthSecret: string;
  accessKeyId: string;
  secretKeyId: string;
  digitalOceanEndPoint: string;
}

export const config: Config = {
  baseurl: process.env.NEXT_PUBLIC_BASE_URL || "",
  secretJwt: process.env.SECRET_JWT || "",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretKeyId: process.env.SECRET_ACCESS_KEY || "",
  digitalOceanEndPoint: process.env.DG_ENDPOINT || "",
};
