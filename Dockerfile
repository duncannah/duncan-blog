FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml .npmrc prisma ./

# Install requirements for node-gyp
RUN apk add --update --no-cache python3 make g++

RUN npm install -g pnpm \
	# node-linker is set to hoisted to not have symlinks
	&& pnpm config set node-linker hoisted \
	&& pnpm install --frozen-lockfile

# Not pruning dev dependencies because we need them for the rebuilding

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add --no-cache ffmpeg

COPY --from=build /usr/src/app /usr/src/app
COPY . .

# Create the .env file
RUN echo "UPLOADS_PATH=/uploads" >> .env \
	&& echo "EXPORT_PATH=/blog" >> .env \
	&& echo "REBUILD_PATH=/usr/src/app" >> .env

# Build the CMS
RUN npx nx build cms

EXPOSE 4201

CMD ["sh", "-c", "npm run deploy-db && npm run start"]