FROM node:12-alpine
COPY . /app/server
WORKDIR /app/server
EXPOSE 8000
RUN yarn
CMD ["yarn", "start"]