# Environment Setup & Scripts

This document describes the environment configuration and available scripts for the Kayra E-commerce monorepo.

## Environment Variables

### Root Environment (env.example)

Copy `env.example` to `.env` in the root directory:

```bash
cp env.example .env
```

**Key Variables:**

- `NODE_ENV`: Environment (development/production)
- `PORT`: Default port for applications
- `NEXT_PUBLIC_API_URL`: Local API endpoint (http://localhost:8080/api)
- `NEXT_PUBLIC_HOST_URL`: Host application URL
- `NEXT_PUBLIC_PRODUCTS_URL`: Products remote URL
- `NEXT_PUBLIC_BASKET_URL`: Basket remote URL

### Application-Specific Environment

Each application has its own environment file:

#### Host Application (apps/host/env.example)

```bash
cp apps/host/env.example apps/host/.env.local
```

#### Products Application (apps/products/env.example)

```bash
cp apps/products/env.example apps/products/.env.local
```

#### Basket Application (apps/basket/env.example)

```bash
cp apps/basket/env.example apps/basket/.env.local
```

## Available Scripts

### Development Scripts

```bash
# Start all applications in parallel
pnpm dev

# Start individual applications
pnpm dev:host      # Host app (port 3000)
pnpm dev:products  # Products app (port 3001)
pnpm dev:basket    # Basket app (port 3002)

# Start all applications with concurrently
pnpm dev:all
```

### Build Scripts

```bash
# Build all applications
pnpm build

# Build individual applications
pnpm build:host     # Build host app
pnpm build:products # Build products app
pnpm build:basket   # Build basket app

# Build libraries only
pnpm build:libs

# Build with analysis
pnpm analyze
```

### Start Scripts

```bash
# Start all applications
pnpm start

# Start individual applications
pnpm start:host     # Start host app
pnpm start:products # Start products app
pnpm start:basket   # Start basket app
```

### Quality Assurance Scripts

```bash
# Linting
pnpm lint           # Run linting
pnpm lint:fix       # Fix linting issues
pnpm lint:check     # Check linting without fixing

# Type checking
pnpm type-check     # Run type checking
pnpm type-check:watch # Watch mode type checking

# Testing
pnpm test           # Run all tests
pnpm test:watch     # Watch mode testing
pnpm test:coverage  # Run tests with coverage
pnpm test:e2e       # Run end-to-end tests

# Formatting
pnpm format         # Format code with Prettier
pnpm format:check   # Check formatting
```

### Module Federation Scripts

```bash
# Check federation configuration
pnpm federation:check

# Build all federation apps
pnpm federation:build

# Start all federation apps
pnpm federation:start
```

### Utility Scripts

```bash
# Installation and setup
pnpm install:all    # Install all dependencies
pnpm setup          # Complete setup (install + build + lint)

# Cleaning
pnpm clean          # Clean build artifacts
pnpm clean:all      # Clean everything including node_modules

# Storybook
pnpm storybook      # Start Storybook
pnpm storybook:build # Build Storybook

# Docker
pnpm docker:build   # Build Docker image
pnpm docker:run     # Run Docker container
pnpm docker:compose # Start with Docker Compose
pnpm docker:compose:down # Stop Docker Compose
```

## Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Individual Docker Commands

```bash
# Build development image
docker build -f Dockerfile.dev -t kayra-dev .

# Run development container
docker run -p 3000:3000 -p 3001:3001 -p 3002:3002 -v $(pwd):/app kayra-dev
```

## Environment Configuration

### Development Environment

```bash
# Setup environment files (automated)
pnpm setup:env

# Or manually copy environment files
cp env.example .env
cp apps/host/env.example apps/host/.env.local
cp apps/products/env.example apps/products/.env.local
cp apps/basket/env.example apps/basket/.env.local

# Install dependencies
pnpm install:all

# Build libraries
pnpm build:libs

# Start development
pnpm dev:all
```

### Production Environment

```bash
# Set production environment
export NODE_ENV=production

# Build all applications
pnpm build

# Start production servers
pnpm start:host
pnpm start:products
pnpm start:basket
```

## Port Configuration

| Application | Port | URL                   |
| ----------- | ---- | --------------------- |
| Host        | 3000 | http://localhost:3000 |
| Products    | 3001 | http://localhost:3001 |
| Basket      | 3002 | http://localhost:3002 |

## Module Federation URLs

| Remote   | URL                                                       |
| -------- | --------------------------------------------------------- |
| Host     | http://localhost:3000/\_next/static/chunks/remoteEntry.js |
| Products | http://localhost:3001/\_next/static/chunks/remoteEntry.js |
| Basket   | http://localhost:3002/assets/remoteEntry.js               |

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, 3002 are available
2. **Module Federation errors**: Run `pnpm federation:check`
3. **Build errors**: Run `pnpm clean` and `pnpm build:libs`
4. **Dependency issues**: Run `pnpm install:all`

### Debug Commands

```bash
# Check federation configuration
pnpm federation:check

# Check environment variables
node -e "console.log(process.env)"

# Check TypeScript configuration
pnpm type-check

# Check linting configuration
pnpm lint:check
```

## Environment Variables Reference

### Root Variables

| Variable                   | Description      | Default                     |
| -------------------------- | ---------------- | --------------------------- |
| `NODE_ENV`                 | Environment mode | `development`               |
| `PORT`                     | Default port     | `3000`                      |
| `NEXT_PUBLIC_API_URL`      | API endpoint     | `http://localhost:8080/api` |
| `NEXT_PUBLIC_HOST_URL`     | Host app URL     | `http://localhost:3000`     |
| `NEXT_PUBLIC_PRODUCTS_URL` | Products app URL | `http://localhost:3001`     |
| `NEXT_PUBLIC_BASKET_URL`   | Basket app URL   | `http://localhost:3002`     |

### Application Variables

| Variable                  | Apps           | Description                |
| ------------------------- | -------------- | -------------------------- |
| `NEXT_PUBLIC_APP_NAME`    | Host, Products | Application name           |
| `NEXT_PUBLIC_APP_VERSION` | Host, Products | Application version        |
| `VITE_APP_NAME`           | Basket         | Application name (Vite)    |
| `VITE_APP_VERSION`        | Basket         | Application version (Vite) |
| `NEXT_TELEMETRY_DISABLED` | Host, Products | Disable Next.js telemetry  |
| `ANALYZE`                 | All            | Enable bundle analysis     |

### Federation Variables

| Variable                          | Description               |
| --------------------------------- | ------------------------- |
| `NEXT_PUBLIC_FEDERATION_HOST`     | Host federation entry     |
| `NEXT_PUBLIC_FEDERATION_PRODUCTS` | Products federation entry |
| `NEXT_PUBLIC_FEDERATION_BASKET`   | Basket federation entry   |

## Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd kayra-export-e-commerce

# 2. Setup environment (automated)
pnpm setup:env

# 3. Install dependencies
pnpm install:all

# 4. Build libraries
pnpm build:libs

# 5. Start development
pnpm dev:all

# 6. Open applications
open http://localhost:3000  # Host
open http://localhost:3001  # Products
open http://localhost:3002  # Basket
```
