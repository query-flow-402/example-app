# QueryFlow SDK Example App

This project demonstrates how to use the **QueryFlow SDK** in a Next.js application to purchase AI insights using real **AVAX**.

## Features

- **Server Actions**: Securely handles private keys on the server side.
- **Real Payments**: Sends actual AVAX transactions on the Fuji Testnet.
- **Type Safety**: Full TypeScript support with `@queryflow-402/sdk`.

## Prerequisites

- Node.js 18+
- An Avalanche Fuji Wallet with some AVAX (get from [faucet](https://core.app/tools/testnet-faucet/)).

## Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

2.  **Configure Environment**

    Create a `.env.local` file in the root directory and add your wallet's private key:

    ```bash
    PRIVATE_KEY=your_private_key_here
    ```

    > ⚠️ **Security Note:** Never commit your `.env.local` file. This example uses the private key server-side only.

3.  **Run the Server**

    ```bash
    npm run dev
    ```

4.  **Try it Out**

    Open [http://localhost:3000](http://localhost:3000). Click "Get Insights" to:

    - Generate a market query.
    - Pay ~$0.02 in AVAX automatically.
    - View the AI-generated insight and transaction hash.

## Key Code

Check `app/actions.ts` to see how the client is initialized:

```typescript
import { QueryFlowClient } from "@queryflow-402/sdk";

const client = new QueryFlowClient(process.env.PRIVATE_KEY, {
  mode: "tx", // Enables real blockchain transactions
});
```
