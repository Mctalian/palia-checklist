# Palia Checklist

Palia Checklist is a Node.js/TypeScript application that automatically resets Villager Weekly Wants in the Palia wiki. The application connects to a MediaWiki API to edit wiki pages and runs on a weekly schedule via GitHub Actions.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here. If there is inconsistent information, open an issue so that the inconsistency can be rectified.

## Working Effectively

### Bootstrap, build, and test the repository:
1. `cd /home/runner/work/palia-checklist/palia-checklist` (or appropriate repository root)
2. `node --version` - Verify Node.js is available. Should be v20+ (project uses v22.19.0, see .nvmrc)
3. `yarn --version` - Verify Yarn is available for package management
4. `yarn install` - Install dependencies. Takes ~1 second. NEVER CANCEL. Set timeout to 120+ seconds.
5. `npm run build` - Build TypeScript to JavaScript. Takes ~3 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

### Linting and formatting:
- `trunk check` - Run linting checks. Takes ~2-3 seconds.
- `trunk fmt` - Auto-fix formatting and linting issues. Takes ~2-3 seconds.
- Repository uses Trunk for linting and formatting (configured in .trunk/trunk.yaml)
- Trunk may require internet access for installation and may not work in sandboxed environments
- If trunk is not available, fallback to: `npx prettier --check src` and `npx prettier --write src`

### Run the application:
- **CRITICAL**: Application requires wiki credentials via environment variables to function
- `npm run debug` - Run the compiled application (node dist/index.js)
- Without credentials, expect: `TypeError: Invalid URL` error - this is NORMAL
- Application runs in dry-run mode by default (DO_WEEKLY_RESET=false)

## Environment Variables

Create a `.env` file in the repository root with these required variables:
```
WIKI_API_URL=https://palia.wiki.gg/api.php
WIKI_USERNAME=your_username
WIKI_PASSWORD=your_password
DEBUG=true
DO_WEEKLY_RESET=false
```

**WARNING**: NEVER commit real credentials. The application will fail with "Invalid URL" error if WIKI_API_URL is empty.

## Validation

- **CORE SCENARIO**: After making changes, always run the complete build and test sequence:
  1. `yarn install` (if dependencies changed)
  2. `npm run build` (always required after TypeScript changes)
  3. `trunk fmt` (ensure formatting and linting)
  4. `npm run debug` (test application startup)
- **Expected behavior WITHOUT credentials**: Application should start, log "Starting Weekly reset..." and "Dry run is enabled", then fail with "Invalid URL" error
- **Expected behavior WITH credentials**: Application should attempt to connect to wiki API (may fail due to network restrictions in sandboxed environments)
- **Manual testing**: The application is designed to run automatically via GitHub Actions. Manual testing requires valid wiki credentials and network access.

## Common Tasks

### Repository structure (ls -la output):
```
.env                 # Environment variables (create manually, not in repo)
.github/             # GitHub Actions workflow
.gitignore          # Git ignore rules
.nvmrc              # Node.js version (v22.19.0)
.prettierignore     # Prettier ignore rules
.trunk/             # Trunk linting configuration
.vscode/            # VS Code settings
README.md           # Project documentation
dist/               # Compiled JavaScript output (COMMITTED to repository)
logs/               # Application logs (generated)
node_modules/       # Dependencies (generated)
package.json        # Node.js project configuration
src/                # TypeScript source code
  index.ts          # Main application entry point
  utils/            # Utility modules
    logger.ts       # Pino logging configuration
    page-helpers.ts # Wiki page helper functions
    params.ts       # Environment variable parsing
    reset-weekly-wants.ts # Core weekly reset logic
    wiki-api.ts     # MediaWiki API wrapper
tsconfig.json       # TypeScript compiler configuration
trunk               # Trunk wrapper script (fallback when trunk not installed)
yarn.lock          # Yarn dependency lock file
```

### Package.json scripts:
- `npm run build` - Compile TypeScript (tsc)
- `npm run build:watch` - Compile TypeScript in watch mode
- `npm run debug` - Run compiled application

### Key dependencies:
- `dotenv` - Environment variable loading
- `nodemw` - MediaWiki API client
- `pino` - Structured logging
- `typescript` - TypeScript compiler

## Build and CI Integration

### GitHub Actions workflow (.github/workflows/reset-weekly-wants.yaml):
- Runs automatically at 03:58 UTC on Mondays
- Can be triggered manually via workflow_dispatch
- Sets up Node.js using .nvmrc version
- Installs dependencies with `yarn install --frozen-lockfile`
- Runs application with `node ./dist/index.js`
- Manual triggers run in dry-run mode, scheduled runs perform live edits

### Local development workflow:
1. Make TypeScript changes in src/
2. Run `npm run build` to compile
3. Run `trunk fmt` to verify formatting and linting
4. Run `npm run debug` to test (will fail without proper .env)
5. Commit changes including updated dist/ files (CI will handle the actual wiki operations)

## Important Notes

- **DESTRUCTIVE OPERATIONS**: When DO_WEEKLY_RESET=true, the application makes live edits to wiki pages
- **Default behavior**: Application runs in dry-run mode unless explicitly configured otherwise
- **Logging**: Application logs to both console (pretty format) and ./logs/weekly-reset.log (JSON format)
- **Error handling**: Application will exit with error codes on failures (network issues, authentication failures, etc.)
- **Network requirements**: Requires outbound HTTPS access to palia.wiki.gg for live operations
- **Git hooks**: Trunk manages git hooks for the repository (pre-commit formatting, pre-push linting)

## Trunk Installation

The repository uses Trunk for linting and formatting. To install trunk locally:

1. **Automatic installation**: `curl -fsSL https://get.trunk.io | bash` (requires internet access)
2. **Via NPX**: `npx @trunkio/launcher install` (uses existing dev dependency)
3. **Local binary**: A `./trunk` script is provided in the repository root as a fallback that uses prettier
4. **Fallback**: If trunk is unavailable, use prettier commands as documented above

Trunk installation may fail in sandboxed environments due to network restrictions. In such cases, use the prettier fallback commands.

## Troubleshooting

### Common errors and solutions:
- `TypeError: Invalid URL` - Missing or empty WIKI_API_URL environment variable (expected in development)
- `Error: getaddrinfo ENOTFOUND` - Network connectivity issues or blocked domain access
- `Request to API failed` - Wiki API authentication or network issues
- Build failures - Usually TypeScript compilation errors, check src/ files for syntax issues
- Formatting failures - Run `trunk fmt` to auto-fix, or fallback to `npx prettier --write src`
- Trunk installation issues - If trunk is not available, use prettier commands as fallback

### Timing expectations:
- Dependency installation: ~1 second
- TypeScript compilation: ~3 seconds  
- Code formatting check: ~1 second
- Application startup: Immediate (fails quickly without credentials)

Always ensure the build completes successfully before making code changes, as this validates the development environment is properly configured.
