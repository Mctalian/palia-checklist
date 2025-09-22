import { logger } from "./logger";

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
};

/**
 * Checks if an error is a 429 rate limiting error from the MediaWiki API
 */
export function isRateLimitError(error: any): boolean {
  if (!error || typeof error.message !== "string") {
    return false;
  }
  
  // Check for HTTP 429 status code in the error message
  return error.message.includes("HTTP status code was 429");
}

/**
 * Calculates the delay for a retry attempt using exponential backoff
 */
export function calculateDelay(attempt: number, options: RetryOptions): number {
  const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt);
  return Math.min(delay, options.maxDelay);
}

/**
 * Sleeps for the specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff when 429 errors occur
 */
export async function retryOnRateLimit<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
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
      logger.warn(
        `Rate limit hit for ${operationName}, attempt ${attempt + 1}/${options.maxAttempts}. Retrying in ${delay}ms...`
      );
      
      await sleep(delay);
    }
  }
  
  logger.error(`Failed ${operationName} after ${options.maxAttempts} attempts due to rate limiting`);
  throw lastError;
}