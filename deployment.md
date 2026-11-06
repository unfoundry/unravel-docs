# Deployment Guide

**Unravel** consists purely of client-side static assets (HTML, CSS, JavaScript, and SVG icons). It has **zero server-side runtime dependencies** and **zero external CDN calls**.

This architecture simplifies deployment, ensures zero maintenance downtime, and allows installation in air-gapped, high-security enterprise intranets.

---

## 1. Hosting Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    Static Web Server / CDN Bucket    │
                      │   (Nginx / S3 / Vercel / Cloudflare)  │
                      └──────────────────┬───────────────────┘
                                         │  (Only delivers HTML/JS/CSS)
                                         ▼
                               ┌───────────────────┐
                               │  User Web Browser │
                               │  ┌─────────────┐  │
                               │  │ In-RAM App  │  │ (No raw file or data
                               │  └─────────────┘  │  ever reaches web server)
                               └─────────┬─────────┘
                                         │
        (Optional direct REST dispatch)  │  (Optional password decrypt)
                                         ▼                             ▼
                      ┌───────────────────────┐    ┌────────────────────────┐
                      │ Enterprise REST API   │    │ XLSX Decryptor Gateway │
                      │ (e.g. Ingestion API)  │    │ (FastAPI, Port 8001)   │
                      └───────────────────────┘    └────────────────────────┘
```

---

## 2. Docker Deployment

A lightweight Nginx Alpine container provides an ideal containerized deployment.

### `Dockerfile`
```dockerfile
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy Unravel app static files
COPY app /usr/share/nginx/html

# Expose web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Build & Run
```bash
docker build -t unravel-app:latest .
docker run -d -p 8080:80 --name unravel unravel-app:latest
```
Access the application at `http://localhost:8080`.

---

## 3. Production Nginx Configuration

Below is a production-grade Nginx configuration with strict HTTP security headers and caching rules:

```nginx
server {
    listen 80;
    server_name unravel.yourdomain.internal;
    root /var/www/unravel/app;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Strict Content Security Policy (No external CDN dependencies)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self' http://localhost:8001 https:;" always;

    # Cache static assets
    location ~* \.(css|js|woff2?|svg|png|jpg|ico)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Static Hosting Platforms

### AWS S3 + CloudFront
1. Create an S3 bucket configured for Static Website Hosting.
2. Sync the `app/` folder:
   ```bash
   aws s3 sync ./app s3://my-unravel-bucket --delete
   ```
3. Attach a CloudFront distribution with an SSL certificate.

### Vercel
Create a `vercel.json` in the root:
```json
{
  "version": 2,
  "public": false,
  "cleanUrls": true,
  "routes": [
    { "src": "/builder/(.*)", "dest": "/app/builder/$1" },
    { "src": "/assets/(.*)", "dest": "/app/assets/$1" },
    { "src": "/(.*)", "dest": "/app/$1" }
  ]
}
```

### Netlify
Create a `netlify.toml` in the root:
```toml
[build]
  publish = "app"
```

---

## 5. Air-Gapped & Offline Deployment

Unravel is **100% self-contained**:
- All vendor libraries (`bootstrap`, `sheetjs`, `papaparse`, `sweetalert2`, `moment`, `bootstrap-icons`) reside under `app/assets/vendor/`.
- No Google Fonts, CDN scripts, or external telemetry pings are made.
- Can be copied onto a USB flash drive or air-gapped subnet and opened directly via `file:///path/to/app/index.html` or a local intranet web server.

