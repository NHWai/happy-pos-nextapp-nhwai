interface Config {
  baseurl: string;
  orderAppUrl: string;
  secretJwt: string;
  clientId: string;
  clientSecret: string;
  nextAuthSecret: string;
  accessKeyId: string;
  secretKeyId: string;
  digitalOceanEndPoint: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

export const config: Config = {
  baseurl: process.env.NEXT_PUBLIC_BASE_URL || "",
  orderAppUrl: process.env.NEXT_PUBLIC_ORDER_APP_URL || "",
  secretJwt: process.env.SECRET_JWT || "",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretKeyId: process.env.SECRET_ACCESS_KEY || "",
  digitalOceanEndPoint: process.env.DG_ENDPOINT || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};
