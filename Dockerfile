FROM registry.gitlab.com/modanisatech/docker-images/node:latest

WORKDIR /app

COPY . .

ARG NODE_ENV 
ENV NODE_ENV ${NODE_ENV}

ENV HOST 0.0.0.0
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT=3000

RUN yarn build

EXPOSE 3000

CMD ["npm", "start"]
