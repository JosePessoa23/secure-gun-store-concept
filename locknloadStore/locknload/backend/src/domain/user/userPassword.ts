import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as crypto from 'crypto';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private static breachedPasswords: Set<string> = new Set();
  private static breachedPasswordsLoaded: boolean = false;

  public get value(): string {
    return this.props.value;
  }

  private constructor(props: any) {
    super(props);
  }

  /**
   * @method comparePassword
   * @desc Compares a plain-text and hashed password.
   */
  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err: any, compareResult: any) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      });
    });
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // bcrypt work factor
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    } else {
      return this.hashPassword(this.normalizeSpaces(this.props.value));
    }
  }

  private normalizeSpaces(password: string): string {
    return password.replace(/\s+/g, ' ');
  }

  public static validatePassword(password: string): boolean {
    const errors = new Map<boolean, string>();
    const lengthRight = password.length >= 12 && password.length <= 128;
    errors.set(lengthRight, 'Password must be 12-64 characters long.');
    // Verify any printable Unicode character is permitted in passwords
    const printableCharsRight = /^[\x20-\x7E]*$/.test(password);
    errors.set(printableCharsRight, 'Password must contain only printable characters.');
    return Array.from(errors.keys()).every((key) => key);
  }

  public static async create(props: UserPasswordProps): Promise<Result<UserPassword>> {
    const propsResult = Guard.againstNullOrUndefined(props.value, 'password');

    if (!propsResult.succeeded) {
      return Result.fail<UserPassword>(propsResult.message);
    } else {
      // Normalize spaces in the password
      const normalizedPassword = props.hashed ? props.value : this.normalizeSpaces(props.value);

      if (!props.hashed) {
        if (!this.validatePassword(normalizedPassword)) {
          return Result.fail<UserPassword>(
            'Password must be 12-64 characters long and contain only printable characters.',
          );
        }

        // Load breached passwords if not loaded
        if (!this.breachedPasswordsLoaded) {
          this.loadBreachedPasswords();
        }

        // Check for breached passwords locally
        if (this.isBreachedPassword(normalizedPassword)) {
          return Result.fail<UserPassword>('Password has been breached. Please choose a different password.');
        }

        const hashedPassword = await this.hashPassword(normalizedPassword);

        return Result.ok<UserPassword>(
          new UserPassword({
            value: hashedPassword,
            hashed: true,
          }),
        );
      }

      return Result.ok<UserPassword>(
        new UserPassword({
          value: normalizedPassword,
          hashed: !!props.hashed === true,
        }),
      );
    }
  }

  private static normalizeSpaces(password: string): string {
    return password.replace(/\s+/g, ' ');
  }

  private static loadBreachedPasswords() {
    const filePath = path.join(__dirname, '../../assets/hibp-passwords.txt');
    const data = fs.readFileSync(filePath, 'utf-8');
    const passwords = data.split('\n');
    this.breachedPasswords = new Set(passwords.map(p => p.trim()));
    this.breachedPasswordsLoaded = true;
  }

  // Local breached passwords check
  private static isBreachedPassword(password: string): boolean {
    return this.breachedPasswords.has(password);
  }

  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // bcrypt work factor
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
}
