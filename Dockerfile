# ----------------------------------- Build ---------------------------------- #
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npx --yes pnpm install

COPY . .

RUN npx --yes pnpm run build

# ----------------------------------- Serve ---------------------------------- #
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]