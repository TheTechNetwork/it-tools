# build stage
FROM node:lts-alpine@sha256:7fddd9ddeae8196abf4a3ef2de34e11f7b1a722119f91f28ddf1e99dcafdf114 AS build-stage
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
FROM nginx:stable-alpine@sha256:0272e4604ed93c1792f03695a033a6e8546840f86e0de20a884bb17d2c924883 AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
