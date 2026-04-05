import { Transaction } from "./Transaction";
import { BankAPI } from "../bank/BankAPI";
import { TransactionLogger } from "../utils/TransactionLogger";

/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ UPIPayment — Processes payments via UPI method                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: POLYMORPHISM                                              │
 * │   Overrides processPayment() from Transaction with UPI-       │
 * │   specific logic. Same method name, DIFFERENT behavior.        │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: INHERITANCE                                               │
 * │   Extends Transaction → which extends BaseTransaction.         │
 * │   Inherits all common fields and methods.                      │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Liskov Substitution Principle (LSP)                     │
 * │   UPIPayment can REPLACE Transaction ANYWHERE in the system    │
 * │   without breaking functionality. PaymentGateway treats it     │
 * │   as a regular Transaction.                                    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Open/Closed Principle (OCP)                             │
 * │   Transaction is extended here, NOT modified.                  │
 * │   We added UPI behavior without touching the base class.       │
 * └─────────────────────────────────────────────────────────────────┘
 */
export class UPIPayment extends Transaction {

    // ── UPI-specific fields ─────────────────────────────────────────
    private _upiId: string;

    // ── Constructor ─────────────────────────────────────────────────
    constructor(txnId: string, amount: number, senderBank: string, receiverBank: string) {
        super(txnId, amount, senderBank, receiverBank);   // Inheritance
        this._upiId = "";
        this.type = "UPI";    // Tag the transaction type
    }

    // ── UPI-specific getter/setter ──────────────────────────────────
    get upiId(): string {
        return this._upiId;
    }
    set upiId(value: string) {
        this._upiId = value;
    }

    // ── POLYMORPHISM: Override processPayment() ─────────────────────
    /**
     * UPI-specific payment processing.
     * Steps:
     *   1. Validate sender & receiver accounts
     *   2. Debit sender's account via BankAPI
     *   3. Credit receiver's account via BankAPI
     *   4. Handle rollback if credit fails
     *
     * @returns true if UPI payment was successful
     */
    override processPayment(): boolean {
        console.log("");
        console.log("  ╔══════════════════════════════════════════════════╗");
        console.log("  ║       📱 Processing UPI Payment...              ║");
        console.log("  ╚══════════════════════════════════════════════════╝");
        console.log(`    → UPI ID      : ${this._upiId || "N/A"}`);
        console.log(`    → Amount      : ₹${this.amount.toFixed(2)}`);
        console.log(`    → Sender Acc  : ${this.senderBank}`);
        console.log(`    → Receiver Acc: ${this.receiverBank}`);
        console.log("");

        // Step 1: Validate sender account
        if (!BankAPI.validateAccount(this.senderBank)) {
            this.status = "FAILED";
            console.log("    ✗ Sender account validation FAILED!");
            TransactionLogger.logTransaction(this);
            return false;
        }

        // Step 2: Validate receiver account
        if (!BankAPI.validateAccount(this.receiverBank)) {
            this.status = "FAILED";
            console.log("    ✗ Receiver account validation FAILED!");
            TransactionLogger.logTransaction(this);
            return false;
        }

        // Step 3: Debit sender's account
        if (BankAPI.debitAmount(this.senderBank, this.amount)) {

            // Step 4: Credit receiver's account
            if (BankAPI.creditAmount(this.receiverBank, this.amount)) {
                this.status = "SUCCESS";
                console.log("    ✓ UPI Payment Successful! ✅");
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
