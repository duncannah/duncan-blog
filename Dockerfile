FROM node:20-alpine as build

# Install requirements for node-gyp
RUN apk add --update --no-cache python3 make g++

USER node
WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml .npmrc prisma ./

# node-linker is set to hoisted to not have symlinks
RUN npx pnpm config set node-linker hoisted \
	&& npx pnpm install --frozen-lockfile

# Not pruning dev dependencies because we need them for the rebuilding

FROM node:20-alpine as production

EXPOSE 4201

# FFmpeg dependency
RUN apk add --no-cache ffmpeg=~5.1.3

USER node
WORKDIR /home/node/app

# Create the .env file
RUN echo "UPLOADS_PATH=/uploads" >> .env \
	&& echo "EXPORT_PATH=/blog" >> .env \
	&& echo "REBUILD_PATH=/home/node/app" >> .env

# Copy node_modules
COPY --from=build /home/node/app /home/node/app
# Copy source code
COPY . .

# Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the CMS
RUN npx nx build cms

CMD ["sh", "-c", "npm run deploy-db && npm run start"]