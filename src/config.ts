import dotenv from 'dotenv';

dotenv.config();
console.log('test')
// console.dir(JSON.stringify(process.env, null, 4));
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
    createTestData: true,
    updateRatingSchedule: { pattern: '*/30 * * * *' },
    updateShikimoriSchedule: { pattern: '*/5 * * * *' },
    autocheckSchedule: { pattern: '0 */1 * * *' },

    /**
     *  .env processing
     */
    appUrl: process.env.APP_URL ?? 'https://api.litminka.ru',
    appPort: process.env.PORT ?? '8001',
    runEnvironment: process.env.NODE_ENV ?? 'production',

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
    ssl: process.env.SSL ?? '0',
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
