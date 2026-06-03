# ----------------------------------- Build ---------------------------------- #
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npx pnpm install --frozen-lockfile

COPY . .

RUN npx pnpm build

# ----------------------------------- Serve ---------------------------------- #
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]