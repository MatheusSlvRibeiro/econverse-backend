import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('maps the JWT payload to the request user', () => {
    const strategy = new JwtStrategy();

    const result = strategy.validate({ sub: 'user-1', email: 'admin@example.com' });

    expect(result).toEqual({ userId: 'user-1', email: 'admin@example.com' });
  });

  it('throws when JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;

    expect(() => new JwtStrategy()).toThrow('JWT_SECRET environment variable is required');
  });
});
