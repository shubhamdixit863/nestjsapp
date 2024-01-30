###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM --platform=linux/amd64 node:lts-alpine as development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# Copy node_modules from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

# Bundle app source for production
RUN npm run build

# Set environment variable for production
ENV NODE_ENV production
ENV DATABASE_URL="postgresql://twocommercial:6%26y4%24%3Ex%23@postgres-timechainlabs.postgres.database.azure.com:5432/truworldbackend?schema=public"

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# BUILD FOR STAGING
###################

FROM node:18-alpine as staging-build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# Copy node_modules from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

# Bundle app source for staging (assumed same as production for now)
RUN npm run build

# Set NODE_ENV for staging
ENV NODE_ENV staging
#ENV DB_URL=postgres-timechainlabs.postgres.database.azure.com
#ENV DB_PORT=5432
#ENV DB_NAME=trueworldbackend-staging
#ENV DB_USER=userlogin
#ENV DB_PASSWORD="H%8#!hz@"
ENV DATABASE_URL="postgresql://userlogin:H%258%23!hz%40@postgres-timechainlabs.postgres.database.azure.com:5432/trueworldbackend-staging?schema=public"

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# STAGING RUN
###################

FROM node:18-alpine as staging

# Copy node_modules and bundled source from staging-build stage
COPY --chown=node:node --from=staging-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=staging-build /usr/src/app/dist ./dist
ENV DATABASE_URL="postgresql://userlogin:H%258%23!hz%40@postgres-timechainlabs.postgres.database.azure.com:5432/trueworldbackend-staging?schema=public"
EXPOSE 80 4200 3000

CMD [ "node", "dist/main.js" ]

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy node_modules and bundled source from build stage
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
ENV DATABASE_URL="postgresql://twocommercial:6%26y4%24%3Ex%23@postgres-timechainlabs.postgres.database.azure.com:5432/truworldbackend?schema=public"
EXPOSE 80 4200 3000

CMD [ "node", "dist/main.js" ]
