interface Config {
  baseurl: string;
  secretJwt: string;
}

export const config: Config = {
  baseurl: process.env.NEXT_PUBLIC_BASE_URL as string,
  secretJwt: process.env.SECRET_JWT as string,
};
