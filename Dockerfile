# build stage
FROM node:lts-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS build-stage
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
FROM nginx:stable-alpine@sha256:97d490c12ba55b4946b01546d1c3ed324e8d41ab1c9fcb2a616aa470620e5b46 AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
