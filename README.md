# Mini Project 3: Intro Express

## Objective
Create a simple URL shortener service using Express.js. This project will focus on implementing routing, middleware, request, and response handling.

## How to Run
### Prerequisites
- node.js
- pnpm

### Steps
1. Clone the repository.
2. Install dependencies and start the server.
```bash
pnpm install
pnpm run dev
```
3. Access the URL shortener service at `http://localhost:3000`.

## Features

- URL validation
- Domain validation
- URL shortening
- URL redirection based on the shortened URL
- Logging of requests and responses

## API Endpoints

### POST /shorten
Shortens a given URL.

#### Request
```json
{
  "url": "https://www.google.com"
}
```

#### Response
```json
{
  "status": "success",
  "shortId": "generated_short_id"
}
```

### GET /shorten/:shortId
Redirects to the original URL based on the shortened URL.

## Error Handling
- Invalid URL
- Invalid domain
- Shortened URL not found