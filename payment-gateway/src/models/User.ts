/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ User — Represents a user in the payment system                 │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ OOP: ENCAPSULATION                                             │
 * │   All fields are PRIVATE. External access is only through      │
 * │   public getters and setters. This protects sensitive data     │
 * │   like MPIN and password from unauthorized direct access.      │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ SOLID: Single Responsibility Principle (SRP)                   │
 * │   This class ONLY manages user data. It does NOT handle        │
 * │   payments, logging, or bank operations.                       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ UML: Composition with Transaction                              │
 * │   User objects are referenced by Transaction (filled diamond). │
 * │   Transaction cannot exist without a User.                     │
 * │ UML: Aggregation with PaymentGateway                           │
 * │   PaymentGateway holds references to Users (hollow diamond).   │
 * │   Users CAN exist independently of the gateway.                │
 * └─────────────────────────────────────────────────────────────────┘
 */
export class User {

    // ── Private Fields (Encapsulation) ──────────────────────────────
    private _name: string;
    private _accountNumber: string;
    private _userId: string;
    private _mpin: number;
    private _password: string;
    private _phoneNumber: string;

    // ── Constructor ─────────────────────────────────────────────────
    constructor(
        name: string,
        accountNumber: string,
        userId: string,
        mpin: number,
        password: string,
        phoneNumber: string
    ) {
        this._name = name;
        this._accountNumber = accountNumber;
        this._userId = userId;
        this._mpin = mpin;
        this._password = password;
        this._phoneNumber = phoneNumber;
    }

    // ── Getters & Setters (as per UML: setName(), getName()) ────────

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get accountNumber(): string {
        return this._accountNumber;
    }
    set accountNumber(value: string) {
        this._accountNumber = value;
    }

    get userId(): string {
        return this._userId;
    }
    set userId(value: string) {
        this._userId = value;
    }

    get mpin(): number {
        return this._mpin;
    }
    set mpin(value: number) {
        this._mpin = value;
    }

    get password(): string {
        return this._password;
    }
    set password(value: string) {
        this._password = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }
    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    // ── Authentication ──────────────────────────────────────────────
    /**
     * Validates if the entered MPIN matches the stored MPIN.
     * Used during payment authorization.
     */
    validateMpin(enteredMpin: number): boolean {
        return this._mpin === enteredMpin;
    }

    /**
     * Validates if the entered password matches the stored password.
     * Used during login.
     */
    validatePassword(enteredPassword: string): boolean {
        return this._password === enteredPassword;
    }

    // ── Display ─────────────────────────────────────────────────────
    toDisplayString(): string {
        return `User: ${this._name} | Account: ${this._accountNumber} | Phone: ${this._phoneNumber}`;
    }
}
