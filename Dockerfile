FROM node:20-alpine as build

WORKDIR /usr/src/app

# Install requirements for node-gyp
RUN apk add --update --no-cache python3 make g++

USER node

COPY package.json pnpm-lock.yaml .npmrc prisma ./

RUN npm install -g pnpm@8.5.0 \
	# node-linker is set to hoisted to not have symlinks
	&& pnpm config set node-linker hoisted \
	&& pnpm install --frozen-lockfile

# Not pruning dev dependencies because we need them for the rebuilding

FROM node:20-alpine as production

WORKDIR /usr/src/app

EXPOSE 4201

# Create the .env file
RUN echo "UPLOADS_PATH=/uploads" >> .env \
	&& echo "EXPORT_PATH=/blog" >> .env \
	&& echo "REBUILD_PATH=/usr/src/app" >> .env

# FFmpeg dependency
RUN apk add --no-cache ffmpeg=~6.0

USER node

# Copy node_modules
COPY --from=build /usr/src/app /usr/src/app
# Copy source code
COPY . .

# Node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the CMS
RUN npx nx build cms

CMD ["sh", "-c", "npm run deploy-db && npm run start"]