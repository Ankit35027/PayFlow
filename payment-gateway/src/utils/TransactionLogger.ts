import { BaseTransaction } from "../models/BaseTransaction";

/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ TransactionLogger — Logging Utility                            │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Single Responsibility Principle (SRP)                   │
 * │   This class has ONE job: logging transactions.                │
 * │   It does NOT process payments, manage users, or interact      │
 * │   with the bank. Logging is completely separated from          │
 * │   business logic.                                              │
 * └─────────────────────────────────────────────────────────────────┘
 */
export class TransactionLogger {

    // ── In-memory log storage ───────────────────────────────────────
    private static logs: string[] = [];

    // ── Log a Transaction ───────────────────────────────────────────
    /**
     * Records a transaction event in the log.
     * @param txn - The transaction to log
     */
    public static logTransaction(txn: BaseTransaction): void {
        const logEntry = `[${new Date().toISOString()}] TXN: ${txn.txnId} | ₹${txn.amount.toFixed(2)} | Status: ${txn.status}`;
        this.logs.push(logEntry);
        console.log(`  📝 Log: ${logEntry}`);
    }

    // ── Log an Error ────────────────────────────────────────────────
    /**
     * Records an error message in the log.
     * @param message - Error description
     */
    public static logError(message: string): void {
        const logEntry = `[${new Date().toISOString()}] ❌ ERROR: ${message}`;
        this.logs.push(logEntry);
        console.error(`  ${logEntry}`);
    }

    // ── Log a Info Message ──────────────────────────────────────────
    /**
     * Records an informational message in the log.
     * @param message - Info description
     */
    public static logInfo(message: string): void {
        const logEntry = `[${new Date().toISOString()}] ℹ️  INFO: ${message}`;
        this.logs.push(logEntry);
    }

    // ── Get All Logs ────────────────────────────────────────────────
    /**
     * Returns all log entries.
     * @returns Array of log strings
     */
    public static getLogs(): string[] {
        return [...this.logs]; // Return a copy to protect internal state
    }

    // ── Print All Logs ──────────────────────────────────────────────
    /**
     * Prints all log entries to the console in formatted style.
     */
    public static printAllLogs(): void {
        console.log("\n  ╔══════════════════════════════════════════════════╗");
        console.log("  ║            📋 Transaction Logs                  ║");
        console.log("  ╚══════════════════════════════════════════════════╝\n");
        if (this.logs.length === 0) {
            console.log("  (No logs recorded yet)");
        } else {
            this.logs.forEach((log, index) => {
                console.log(`  ${index + 1}. ${log}`);
            });
        }
    }
}
