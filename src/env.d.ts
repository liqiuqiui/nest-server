declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_PORT: number;

      APPID: string;
      SECRET: string;
    }
  }
}

export {};
