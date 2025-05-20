## Docker Setup Instructions

1. **Install Docker**: Download from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. **Run the Docker Container**:

From Docker Hub:

```bash
docker run -d -p 3001:3001 \
--name your-shrtn-container \
-v ./data:/data \
-e ORIGIN=http://localhost:3001 \
-e MAIL_FROM=noreply@example.com \
cordlesswool/shrtn
```

From GitHub Container Registry (ghcr.io):

```bash
docker run -d -p 3001:3001 \
--name your-shrtn-container \
-v ./data:/data \
-e ORIGIN=http://localhost:3001 \
-e MAIL_FROM=noreply@example.com \
ghcr.io/cordlesswool/shrtn
```

3. **Access the Application**: Navigate to `http://localhost:3001`.

## Setup from Downloaded Package

1. **Download and Extract**: Get the package from the [releases page](https://github.com/CordlessWool/shrtn/releases) and extract it.
2. **Install Dependencies and Start**:
   ```bash
   bun install --production
   bun run db:migrate
   node ./index.js
   ```
3. **Access the Application**: Navigate to `http://localhost:3001`.

## Environment Variables

To configure the application, set the following environment variables. Default values are provided for convenience.

```
# Database connection string
DATABASE_URL=file:sqlite_file_name.db

# Base URL for the public-facing site, could also be provided by request headers
ORIGIN=http://localhost:5173

# Using SMTP to send emails
MAIL_PROVIDER=smtp
MAIL_HOST=smtp.example.com
MAIL_FROM=noreply@example.com
MAIL_PORT=465
MAIL_USER=noreply@example.com
MAIL_PASS=secure_password

# Using Mailgun to send emails
MAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_URL=https://api.mailgun.net

# Using Mailpit to send emails
MAIL_PROVIDER=mailpit
MAILPIT_DOMAIN=http://localhost:8025

# Time-to-live settings for temporary and user-generated content
## Possible values: HOUR, DAY, WEEK, MONTH, YEAR, EVER
PUBLIC_TTL_TEMP=YEAR  # Temporary content expires after 30 days
PUBLIC_TTL_USER=EVER # User-generated content expires after 1 year
```

## Database

With the Version 2 the package switched from `better-sqlite3` to `libSQL`. This means you can now use a higher variety of databases.

In combination with Cloudflare you will now be able to use Cloudflare D1.

## Cloudflare Worker

In version 2, support for Cloudflare workers was added. There is a wrangler file in the source directory.

Remember to adapt the envs to your needs.
