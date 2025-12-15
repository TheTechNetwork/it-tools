# build stage
FROM node:lts-alpine@sha256:7e0bd0460b26eb3854ea5b99b887a6a14d665d14cae694b78ae2936d14b2befb AS build-stage
# Set environment variables for non-interactive npm installs
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy only dependency files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (cached if lockfile doesn't change)
RUN pnpm i --frozen-lockfile

# Copy source code (changes frequently, placed after deps install)
COPY . .

# Build the application
RUN pnpm build

# production stage
FROM nginx:stable-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284 AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
