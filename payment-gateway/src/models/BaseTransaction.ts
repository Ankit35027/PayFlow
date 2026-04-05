/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ BaseTransaction — Abstract Base Class                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: INHERITANCE                                               │
 * │   This is the BASE CLASS that Transaction extends.             │
 * │   Common fields (txnId, amount, timestamp) live here so        │
 * │   all transaction types inherit them without duplication.       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: ABSTRACTION                                               │
 * │   processPayment() is abstract — subclasses MUST implement it. │
 * │   This hides implementation details and exposes only the API.  │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: ENCAPSULATION                                             │
 * │   All fields are PRIVATE — accessible only via getters/setters.│
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Open/Closed Principle (OCP)                             │
 * │   OPEN for extension  → new transaction types can extend it.   │
 * │   CLOSED for modification → no changes needed here for that.   │
 * └─────────────────────────────────────────────────────────────────┘
 */
export abstract class BaseTransaction {

    // ── Private Fields (Encapsulation) ──────────────────────────────
    private _txnId: string;
    private _amount: number;
    private _timestamp: Date;
    private _status: string; // PENDING | SUCCESS | FAILED | CANCELLED

    // ── Constructor ─────────────────────────────────────────────────
    constructor(txnId: string, amount: number) {
        this._txnId = txnId;
        this._amount = amount;
        this._timestamp = new Date();   // Auto-set to current time
        this._status = "PENDING";       // Default status
    }

    // ── Abstract Method (Polymorphism + Abstraction) ────────────────
    /**
     * Process the payment. Each transaction type (UPI, NetBanking)
     * implements this differently — demonstrating POLYMORPHISM.
     *
     * @returns true if payment was successful, false otherwise
     */
    abstract processPayment(): boolean;

    // ── Getters and Setters (Encapsulation) ─────────────────────────

    get txnId(): string {
        return this._txnId;
    }
    set txnId(value: string) {
        this._txnId = value;
    }

    get amount(): number {
        return this._amount;
    }
    set amount(value: number) {
        this._amount = value;
    }

    get timestamp(): Date {
        return this._timestamp;
    }
    set timestamp(value: Date) {
        this._timestamp = value;
    }

    get status(): string {
        return this._status;
    }
    set status(value: string) {
        this._status = value;
    }

    // ── Display ─────────────────────────────────────────────────────
    toDisplayString(): string {
        return `TxnID: ${this._txnId} | Amount: ₹${this._amount.toFixed(2)} | Status: ${this._status} | Time: ${this._timestamp.toLocaleString()}`;
    }
}
