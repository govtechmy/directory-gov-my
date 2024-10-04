declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    AUTH_TOKEN: string;
    APP_ENV: string;
    REVALIDATE_TOKEN: string;

    NEXT_PUBLIC_CLARITY_PROJECT_ID: string;
    NEXT_PUBLIC_TINYBIRD_HOST: string;
    NEXT_PUBLIC_TINYBIRD_TOKEN: string;
    LAST_UPDATED: string;

    ES_URL: string;
    ES_API_KEY: string;
  }
}
