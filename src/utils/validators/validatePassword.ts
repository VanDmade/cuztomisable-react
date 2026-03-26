// utils/validators/validatePassword.ts

export type PasswordPolicy = {
    minimum: number;
    maximum?: number | null;
    numbers: number;
    symbols: number;
    lowercase: number;
    uppercase: number;
};

export type PasswordValidationResult = {
    lengthMinOk: boolean;
    lengthMaxOk: boolean;
    numbersOk: boolean;
    symbolsOk: boolean;
    lowercaseOk: boolean;
    uppercaseOk: boolean;
};

export function validatePassword(
    password: string,
    policy: PasswordPolicy
): PasswordValidationResult {
    const { numbers, symbols, minimum, maximum, lowercase, uppercase } = policy;

    const numCount = (password.match(/[0-9]/g) || []).length;
    const symCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
    const lowerCount = (password.match(/[a-z]/g) || []).length;
    const upperCount = (password.match(/[A-Z]/g) || []).length;
    const length = password.length;

    return {
        lengthMinOk: length >= minimum,
        lengthMaxOk: maximum ? length <= maximum : true,
        numbersOk: numCount >= numbers,
        symbolsOk: symCount >= symbols,
        lowercaseOk: lowerCount >= lowercase,
        uppercaseOk: upperCount >= uppercase,
    };
}