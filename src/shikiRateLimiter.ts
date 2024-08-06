import { RateLimiter } from 'limiter';
import config from '@/config';
declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var shikiRateLimiter: RateLimiter;
}
export const shikiRateLimiter =
    global.shikiRateLimiter || new RateLimiter({ tokensPerInterval: 5, interval: 'sec' });
if (config.runEnvironment !== 'production') global.shikiRateLimiter = shikiRateLimiter;
