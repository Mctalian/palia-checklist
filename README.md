# palia-checklist

Originally, this repo was going to power a checklist for gift giving for the various villagers in [Palia](https://palia.com/) for a given week.

I ended up pausing the project, but this still has code that is used to reset each Villager's Weekly Wants in the wiki at the start of each game week (4am UTC Mondays).

**Beware** blindly running the reset function may actually delete data in the wiki.

## Features

- **Rate Limit Handling**: Automatically handles HTTP 429 errors with exponential backoff retry logic
- **Configurable Retries**: Customizable retry attempts, delays, and backoff multipliers
- **Detailed Logging**: Comprehensive logging for debugging and monitoring retry attempts

## Setup

1. Clone the repo
1. Ensure node is installed, ideally via nvm (check .nvmrc for the version of node)
1. Ensure `yarn` is installed
1. Run `yarn` from the root directory to install dependencies

## Error Handling

The WikiApi class now includes robust error handling for rate limiting scenarios:

- **Automatic 429 Retry**: HTTP 429 (rate limit) errors are automatically retried with exponential backoff
- **Configurable Options**: Retry behavior can be customized via `RetryOptions`
- **Preserved Behavior**: Non-429 errors are handled the same as before (immediate failure)
- **Operation Logging**: Each retry attempt is logged with timing information

### Default Retry Configuration

- **Max Attempts**: 3
- **Base Delay**: 1000ms (1 second)
- **Max Delay**: 30000ms (30 seconds)  
- **Backoff Multiplier**: 2 (exponential)

## Screenshots

![image](https://github.com/user-attachments/assets/ef240138-a2f7-41f6-8827-3b738565ae47)
