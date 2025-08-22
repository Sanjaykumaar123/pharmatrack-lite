
import { getSolanaConnection } from './client';
import { allMedicines } from '@/lib/data';
import type { Medicine } from '@/types';

// ===================================================================================
// SOLANA BLOCKCHAIN SERVICE
// ===================================================================================
// This file is responsible for all direct interactions with your Solana program
// (smart contract). It serves as an abstraction layer between your UI components
// and the blockchain.
//
// In a real-world application:
// - `getMedicinesFromChain` would query your on-chain program to fetch all medicine
//   accounts.
// - `addMedicineToChain` would construct and send a transaction to the program
//   to create a new medicine account.
// ===================================================================================


/**
 * Fetches all medicines from the blockchain.
 * 
 * NOTE: This is a SIMULATION. It currently returns mock data.
 * In a real implementation, you would use the `connection` object to query
 * your Solana program's accounts and deserialize their data.
 */
export async function getMedicinesFromChain(): Promise<Medicine[]> {
    const connection = getSolanaConnection();
    console.log('Fetching medicines from Solana devnet...');
    // In a real app, you would use `connection.getProgramAccounts(...)` here.

    // We'll return the mock data for now to keep the UI functional.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    console.log('Successfully fetched medicines.');
    return allMedicines;
}

/**
 * Adds a new medicine to the blockchain.
 * 
 * NOTE: This is a SIMULATION. It currently only logs to the console.
 * In a real implementation, you would construct a transaction with an
 * instruction to call your program's "add_medicine" function, then send
 * it to the network using the `connection` object.
 * 
 * @param medicine The new medicine data to add.
 */
export async function addMedicineToChain(medicine: Medicine): Promise<void> {
    const connection = getSolanaConnection();
    console.log('Preparing to add new medicine to the Solana devnet:', medicine);
    console.log('Connection to cluster established:', connection.rpcEndpoint);

    // In a real app, you would build and send a transaction here.
    // Example:
    // const transaction = new Transaction().add(
    //   new TransactionInstruction({
    //     keys: [...],
    //     programId,
    //     data: Buffer.from(...),
    //   })
    // );
    // await sendAndConfirmTransaction(connection, transaction, [payer]);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    console.log(`Simulated adding ${medicine.name} to the ledger.`);
}
