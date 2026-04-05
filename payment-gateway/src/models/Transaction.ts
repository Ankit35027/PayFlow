import { BaseTransaction } from "./BaseTransaction";
import { User } from "./User";

/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Transaction — Extends BaseTransaction with sender/receiver     │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: INHERITANCE                                               │
 * │   Extends BaseTransaction — inherits txnId, amount, timestamp, │
 * │   status, and the abstract processPayment() method.            │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: ENCAPSULATION                                             │
 * │   All fields are private with getters/setters.                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ UML: COMPOSITION with User (filled diamond ◆)                  │
 * │   Transaction holds references to sender and receiver User.    │
 * │   A Transaction CANNOT exist without a User — if the           │
 * │   Transaction is destroyed, its User references go with it.    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Open/Closed Principle (OCP)                             │
 * │   UPIPayment and NetBankingPayment extend this class.          │
 * │   Adding new payment types requires ZERO changes to this class.│
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Liskov Substitution Principle (LSP)                     │
 * │   UPIPayment and NetBankingPayment can replace Transaction     │
 * │   anywhere without breaking the system.                        │
 * └─────────────────────────────────────────────────────────────────┘
 */
export class Transaction extends BaseTransaction {

    // ── Private Fields ──────────────────────────────────────────────
    private _senderBank: string;
    private _receiverBank: string;
    private _sender: User | null;      // Composition: owned by Transaction
    private _receiver: User | null;    // Composition: owned by Transaction
    private _type: string;             // "UPI" | "NETBANKING" | "BASE"

    // ── Constructor ─────────────────────────────────────────────────
    constructor(txnId: string, amount: number, senderBank: string, receiverBank: string) {
        super(txnId, amount);  // Call parent constructor (Inheritance)
        this._senderBank = senderBank;
        this._receiverBank = receiverBank;
        this._sender = null;
        this._receiver = null;
        this._type = "BASE";
    }

    // ── processPayment (base implementation) ────────────────────────
    /**
     * Base implementation — overridden by UPIPayment and NetBankingPayment.
     * Demonstrates POLYMORPHISM: same method name, different behavior.
     */
    processPayment(): boolean {
        console.log("  [Transaction] Base processPayment() called.");
        console.log("  ⚠  Use a specific payment type (UPI / NetBanking) instead.");
        return false;
    }

    // ── Getters & Setters ───────────────────────────────────────────

    get senderBank(): string {
        return this._senderBank;
    }
    set senderBank(value: string) {
        this._senderBank = value;
    }

    get receiverBank(): string {
        return this._receiverBank;
    }
    set receiverBank(value: string) {
        this._receiverBank = value;
    }

    get sender(): User | null {
        return this._sender;
    }
    set sender(value: User | null) {
        this._sender = value;
    }

    get receiver(): User | null {
        return this._receiver;
    }
    set receiver(value: User | null) {
        this._receiver = value;
    }

    get type(): string {
        return this._type;
    }
    set type(value: string) {
        this._type = value;
    }

    // ── Display (override parent) ───────────────────────────────────
    override toDisplayString(): string {
        const senderName = this._sender?.name ?? "N/A";
        const receiverName = this._receiver?.name ?? "N/A";
        return `${super.toDisplayString()} | Type: ${this._type} | From: ${senderName} → To: ${receiverName}`;
    }
}
