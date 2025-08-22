
import { Connection, clusterApiUrl } from '@solana/web3.js';

// ===================================================================================
// SOLANA BLOCKCHAIN INTEGRATION POINT
// ===================================================================================
// This file serves as the central hub for our Solana blockchain interactions.
//
// - `connection`: A configured connection to the Solana devnet.
// - `getSolanaConnection()`: A function to get the shared connection instance.
// ===================================================================================


// We are connecting to the 'devnet', which is a test network provided by Solana.
// It's the perfect environment for development and testing without using real funds.
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

/**
 * Returns a shared connection instance to the Solana devnet.
 * In a larger application, this helps manage connections efficiently.
 */
export function getSolanaConnection(): Connection {
    return connection;
}
