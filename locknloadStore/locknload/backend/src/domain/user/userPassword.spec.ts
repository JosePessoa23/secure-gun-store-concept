import { UserPassword } from './userPassword';

describe('UserPassword', () => {
  it('should create a valid password object with a plain text password', async () => {
    const passwordProps = { value: 'ValidPassword123!' };
    const result = await UserPassword.create(passwordProps);
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().value).not.toBe(passwordProps.value); // Should be hashed
  });

  it('should not truncate the password', async () => {
    const longPassword = 'A'.repeat(64);
    const passwordProps = { value: longPassword };
    const result = await UserPassword.create(passwordProps);
    expect(result.isSuccess).toBe(true);
    // Check if the hashed password length is consistent with bcrypt's hash length
    expect(result.getValue().value.length).toBeGreaterThanOrEqual(60);
  });

  it('should not accept passwords shorter than 12 characters', async () => {
    const shortPassword = 'Short1!';
    const passwordProps = { value: shortPassword };
    const result = await UserPassword.create(passwordProps);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Password must be 12-64 characters long and contain only printable characters.');
  });

  it('should compare plain text password with hashed password correctly', async () => {
    const passwordProps = { value: 'ValidPassword123!' };
    const passwordObject = await UserPassword.create(passwordProps);
    const isMatch = await passwordObject.getValue().comparePassword('ValidPassword123!');
    expect(isMatch).toBe(true);
  });

  it('should not compare plain text password with incorrect password', async () => {
    const passwordProps = { value: 'ValidPassword123!' };
    const passwordObject = await UserPassword.create(passwordProps);
    const isMatch = await passwordObject.getValue().comparePassword('InvalidPassword123!');
    expect(isMatch).toBe(false);
  });

  it('should hash the password correctly', async () => {
    const password = 'ValidPassword123!';
    const hashedPassword = await UserPassword.create({ value: password });
    expect(hashedPassword.getValue().getHashedValue()).not.toBe(password);
  });

  it('should validate password length between 12 and 64 characters', () => {
    const validPassword = 'A'.repeat(12);
    const invalidPasswordShort = 'A'.repeat(11);
    const invalidPasswordLong = 'A'.repeat(129);

    expect(UserPassword.validatePassword(validPassword)).toBe(true);
    expect(UserPassword.validatePassword(invalidPasswordShort)).toBe(false);
    expect(UserPassword.validatePassword(invalidPasswordLong)).toBe(false);
  });

  it('should validate password to include only printable characters', () => {
    const validPassword = 'ValidPassword123!';
    const invalidPassword = 'InvalidPassword\x01';

    expect(UserPassword.validatePassword(validPassword)).toBe(true);
    expect(UserPassword.validatePassword(invalidPassword)).toBe(false);
  });

  it('should normalize spaces in the password', () => {
    const password = 'Password   with     spaces';
    const normalizedPassword = UserPassword['normalizeSpaces'](password);
    expect(normalizedPassword).toBe('Password with spaces');
  });
});
