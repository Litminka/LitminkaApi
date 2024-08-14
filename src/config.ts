import dotenv from 'dotenv';

const __stringToBool = (arg?: string, envName?: string) => {
    if (!arg) return undefined;
    switch (arg.toLowerCase()) {
        case 'true':
        case '1': {
            return true;
        }
        case 'false':
        case '0': {
            return false;
        }
    }
    const errMessage = `String must be boolean: \${${envName ?? 'stringName'}}`;
    throw new Error(errMessage);
};

dotenv.config();
export default {
    /**
     * ignore these licensors for geoban when parsing shikimori anime
     */
    ignoreLicensors: [
        'Wakanim',
        'Crunchyroll',
        'Netflix',
        'Dentsu',
        'Русский Репортаж',
        '2x2',
        '1C',
        '1С',
        'FAN',
        'Синема Галэкси',
        'Мега-Аниме',
        'Экспонента',
        'All Media Company'
    ],
    ratingMinVotes: 5,
    ratingUpdateSchedule: { pattern: '*/5 * * * *' },
    relationUpdateSchedule: { pattern: '*/30 * * * *' },
    autocheckSchedule: { pattern: '*/10 * * * *' },

    /**
     *  .env processing
     */
    appUrl: process.env.APP_URL ?? 'https://api.litminka.ru',
    appPort: process.env.PORT ?? '8001',
    runEnvironment: process.env.NODE_ENV ?? 'production',
    debug: __stringToBool(process.env.DEBUG, 'DEBUG') ?? false,
    createTestData: __stringToBool(process.env.CREATE_TEST_DATA, 'CREATE_TEST_DATA') ?? false,

    // LitminkaApi root user
    rootLogin: process.env.ROOT_LOGIN ?? 'admin',
    rootPassword: process.env.ROOT_PASS ?? 'admin',

    // Shikimori integration parameters
    tokenSecret: process.env.TOKEN_SECRET ?? '',
    tokenLife: process.env.TOKEN_LIFE ?? '1d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE ?? '14d',

    // Shikimori integration parameters
    shikimoriUrl: process.env.SHIKIMORI_URL ?? 'https://shikimori.one',
    shikimoriClientId: process.env.SHIKIMORI_CLIENT_ID ?? '',
    shikimoriClientSecret: process.env.SHIKIMORI_CLIENT_SECRET ?? '',
    shikimoriAgent: process.env.SHIKIMORI_AGENT ?? 'Litminka',
    shikimoriAppId: process.env.SHIKIMORI_APP_ID ?? '0',

    // Kodik integration parameters
    kodikApiKey: process.env.KODIK_API_KEY ?? '',
    country: process.env.COUNTRY_SN ?? 'RU',

    // SSL parameters for nodeJS application
    ssl: __stringToBool(process.env.SSL, 'SSL') ?? false,
    sslCert: process.env.SSL_CERT ?? 'cert/server-cert.pem',
    sslKey: process.env.SSL_KEY ?? 'cert/server-key.pem',

    // PostgreSQL connection
    databaseUrl:
        process.env.DATABASE_URL ??
        'postgresql://litminka:password@localhost:5432/litminka?schema=public',

    // Redis connection
    redisPort: process.env.REDIS_PORT ?? '6379',
    redisHost: process.env.REDIS_HOST ?? 'localhost'
};
