# ----------------------------------- Build ---------------------------------- #
FROM node:24-alpine AS builder
WORKDIR /app

ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}

COPY package.json pnpm-lock.yaml ./
RUN npx --yes pnpm install
COPY . .
RUN npx --yes pnpm run build

# ----------------------------------- Serve ---------------------------------- #
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV NGINX_BASE_PATH=/

EXPOSE ${INTERNAL_FRONTEND_PORT:-80}
CMD ["nginx", "-g", "daemon off;"]