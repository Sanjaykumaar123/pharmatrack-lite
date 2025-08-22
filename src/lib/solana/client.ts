import { Connection, clusterApiUrl } from "@solana/web3.js";

export const SOLANA_CLUSTER = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? "devnet") as
  | "devnet"
  | "testnet"
  | "mainnet-beta";

// You can bump commitment to 'finalized' if needed
export const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER), "confirmed");
