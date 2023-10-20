FROM node:21-alpine as build

# Install requirements for node-gyp
RUN apk add --update --no-cache python3 make g++

USER node
WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml .npmrc prisma ./

# node-linker is set to hoisted to not have symlinks
RUN npx pnpm config set node-linker hoisted \
	&& npx pnpm install --frozen-lockfile

# Not pruning dev dependencies because we need them for the rebuilding

FROM node:21-alpine as production

EXPOSE 4201

# Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV UPLOADS_PATH="/uploads"
ENV EXPORT_PATH="/blog"
ENV REBUILD_PATH="/home/node/app"

# FFmpeg dependency
RUN apk add --no-cache ffmpeg

USER node
WORKDIR $REBUILD_PATH

# Copy node_modules
COPY --from=build /home/node/app .
# Copy source code
COPY . .

# Build the CMS
RUN npx nx build cms

CMD ["sh", "-c", "npm run deploy-db && npm run start"]