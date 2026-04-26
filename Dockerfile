FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

ARG VITE_API_BASE_URL=
ARG VITE_TENANT_SLUG=
ARG VITE_OTP_MODE=api
ARG VITE_R2_MODE=api
ARG VITE_AUDIT_SIGNATURE_MODE=api
ARG VITE_AUDIT_SIGNATURE_ENDPOINT=/api/audit/sign

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TENANT_SLUG=$VITE_TENANT_SLUG
ENV VITE_OTP_MODE=$VITE_OTP_MODE
ENV VITE_R2_MODE=$VITE_R2_MODE
ENV VITE_AUDIT_SIGNATURE_MODE=$VITE_AUDIT_SIGNATURE_MODE
ENV VITE_AUDIT_SIGNATURE_ENDPOINT=$VITE_AUDIT_SIGNATURE_ENDPOINT

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
