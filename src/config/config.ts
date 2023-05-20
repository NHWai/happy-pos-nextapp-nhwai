interface Config {
  baseurl: string;
}

export const config: Config = {
  baseurl: process.env.BASE_URL as string,
};
