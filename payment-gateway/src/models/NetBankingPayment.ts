import { Transaction } from "./Transaction";
import { BankAPI } from "../bank/BankAPI";
import { TransactionLogger } from "../utils/TransactionLogger";

/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ NetBankingPayment — Processes payments via Net Banking          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: POLYMORPHISM                                              │
 * │   Overrides processPayment() from Transaction with NetBanking- │
 * │   specific logic. Same method name, DIFFERENT behavior from    │
 * │   UPIPayment — this is runtime polymorphism in action.         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: INHERITANCE                                               │
 * │   Extends Transaction → which extends BaseTransaction.         │
 * │   Full inheritance chain: BaseTransaction → Transaction →      │
 * │   NetBankingPayment.                                           │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Liskov Substitution Principle (LSP)                     │
 * │   NetBankingPayment can REPLACE Transaction ANYWHERE without   │
 * │   breaking the system — just like UPIPayment can.              │
 * └─────────────────────────────────────────────────────────────────┘
 */
export class NetBankingPayment extends Transaction {

    // ── NetBanking-specific fields ──────────────────────────────────
    private _bankCode: string;
    private _ifscCode: string;

    // ── Constructor ─────────────────────────────────────────────────
    constructor(txnId: string, amount: number, senderBank: string, receiverBank: string) {
        super(txnId, amount, senderBank, receiverBank);   // Inheritance
        this._bankCode = "";
        this._ifscCode = "";
        this.type = "NETBANKING";    // Tag the transaction type
    }

    // ── NetBanking-specific getters/setters ─────────────────────────
    get bankCode(): string {
        return this._bankCode;
    }
    set bankCode(value: string) {
        this._bankCode = value;
    }

    get ifscCode(): string {
        return this._ifscCode;
    }
    set ifscCode(value: string) {
        this._ifscCode = value;
    }

    // ── POLYMORPHISM: Override processPayment() ─────────────────────
    /**
     * NetBanking-specific payment processing.
     * Steps:
     *   1. Verify IFSC code (simulated)
     *   2. Validate sender & receiver accounts
     *   3. Debit sender's account via BankAPI
     *   4. Credit receiver's account via BankAPI
     *   5. Handle rollback if credit fails
     *
     * DIFFERENCE FROM UPI:
     *   - Net Banking verifies IFSC code before processing
     *   - Net Banking uses bank code for routing (simulated)
     *   - Processing messages are different (demonstrates polymorphism)
     *
     * @returns true if NetBanking payment was successful
     */
    override processPayment(): boolean {
        console.log("");
        console.log("  ╔══════════════════════════════════════════════════╗");
        console.log("  ║       🏦 Processing Net Banking Payment...      ║");
        console.log("  ╚══════════════════════════════════════════════════╝");
        console.log(`    → Bank Code    : ${this._bankCode || "N/A"}`);
        console.log(`    → IFSC Code    : ${this._ifscCode || "N/A"}`);
        console.log(`    → Amount       : ₹${this.amount.toFixed(2)}`);
        console.log(`    → Sender Acc   : ${this.senderBank}`);
        console.log(`    → Receiver Acc : ${this.receiverBank}`);
        console.log("");

        // Step 1: Verify IFSC Code (simulated — always valid if non-empty)
        if (!this._ifscCode || this._ifscCode.length === 0) {
            console.log("    ⚠  No IFSC code provided. Using default routing...");
        } else {
            console.log(`    ✓ IFSC Code ${this._ifscCode} verified.`);
        }

        // Step 2: Validate sender account
        if (!BankAPI.validateAccount(this.senderBank)) {
            this.status = "FAILED";
            console.log("    ✗ Sender account validation FAILED!");
            TransactionLogger.logTransaction(this);
            return false;
        }

        // Step 3: Validate receiver account
        if (!BankAPI.validateAccount(this.receiverBank)) {
            this.status = "FAILED";
            console.log("    ✗ Receiver account validation FAILED!");
            TransactionLogger.logTransaction(this);
            return false;
        }

        // Step 4: Debit sender's account
        console.log("    ⏳ Initiating inter-bank transfer via NEFT...");
        if (BankAPI.debitAmount(this.senderBank, this.amount)) {

            // Step 5: Credit receiver's account
            if (BankAPI.creditAmount(this.receiverBank, this.amount)) {
                this.status = "SUCCESS";
                console.log("    ✓ Net Banking Payment Successful! ✅");
                console.log("    ℹ  Settlement: Processed via NEFT/RTGS channel.");
                TransactionLogger.logTransaction(this);
                return true;
            } else {
                // Rollback: Credit amount back to sender
                BankAPI.creditAmount(this.senderBank, this.amount);
                this.status = "FAILED";
                console.log("    ✗ Credit to receiver failed! Amount refunded.");
                TransactionLogger.logTransaction(this);
                return false;
            }

        } else {
            this.status = "FAILED";
            console.log("    ✗ Insufficient balance in sender's account!");
            TransactionLogger.logTransaction(this);
            return false;
        }
    }
}
