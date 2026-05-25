# Howard AI Member Web

Howard AI member site built with React, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

## Environment Variables

This project uses Vite's built-in `.env` loading. You do not need to install or import `dotenv` manually for client-side variables.

Create a local `.env` file in the project root and add:

```bash
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

You can copy from [.env.example](/Users/marco/Dev/Projects/Project/CoinBridge/HowardAI_Member/howardai-member-web/.env.example).

Only variables prefixed with `VITE_` are exposed to the browser.

## Build

```bash
npm run build
```
