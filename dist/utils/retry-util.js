"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RETRY_OPTIONS = void 0;
exports.isRateLimitError = isRateLimitError;
exports.calculateDelay = calculateDelay;
exports.sleep = sleep;
exports.retryOnRateLimit = retryOnRateLimit;
const logger_1 = require("./logger");
exports.DEFAULT_RETRY_OPTIONS = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
};
/**
 * Checks if an error is a 429 rate limiting error from the MediaWiki API
 */
function isRateLimitError(error) {
    if (!error || typeof error.message !== "string") {
        return false;
    }
    // Check for HTTP 429 status code in the error message
    return error.message.includes("HTTP status code was 429");
}
/**
 * Calculates the delay for a retry attempt using exponential backoff
 */
function calculateDelay(attempt, options) {
    const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt);
    return Math.min(delay, options.maxDelay);
}
/**
 * Sleeps for the specified number of milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retries a function with exponential backoff when 429 errors occur
 */
async function retryOnRateLimit(operation, operationName, options = exports.DEFAULT_RETRY_OPTIONS) {
    let lastError;
    for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Only retry on rate limit errors
            if (!isRateLimitError(error)) {
                throw error;
            }
            // Don't wait after the last attempt
            if (attempt === options.maxAttempts - 1) {
                break;
            }
            const delay = calculateDelay(attempt, options);
            logger_1.logger.warn(`Rate limit hit for ${operationName}, attempt ${attempt + 1}/${options.maxAttempts}. Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
    logger_1.logger.error(`Failed ${operationName} after ${options.maxAttempts} attempts due to rate limiting`);
    throw lastError;
}
//# sourceMappingURL=retry-util.js.map