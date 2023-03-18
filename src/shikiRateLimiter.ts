import { RateLimiter } from 'limiter';
declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var shikiRateLimiter: RateLimiter

}
export const shikiRateLimiter = global.shikiRateLimiter || new RateLimiter({ tokensPerInterval: 5, interval: "sec" });
if (process.env.NODE_ENV !== 'production') global.shikiRateLimiter = shikiRateLimiter;  