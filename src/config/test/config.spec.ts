describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const setEnv = (env: Record<string, string | undefined>) => {
    process.env = { ...process.env, ...env };
  };

  const getConfig = () => require('../config').config;

  it('should load config with custom values', () => {
    setEnv({
      NODE_ENV: 'test',
      PORT: '3001',
      JWT_SECRET: 'test-secret',
      ADMIN_EMAIL: 'admin@test.com',
      ADMIN_PASSWORD: 'admin123',
    });

    const config = getConfig();
    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(3001);
    expect(config.jwt.secret).toBe('test-secret');
    expect(config.admin.email).toBe('admin@test.com');
  });

  it('should use default values for optional fields', () => {
    setEnv({
      NODE_ENV: undefined,
      PORT: undefined,
      JWT_SECRET: 'required-secret',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'admin123',
    });

    const config = getConfig();
    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.jwt.expiresIn).toBe('1h');
  });

  it('should throw error for missing required fields', () => {
    const requiredFields = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];

    requiredFields.forEach((field) => {
      setEnv({
        JWT_SECRET: 'test-secret',
        ADMIN_EMAIL: 'admin@example.com',
        ADMIN_PASSWORD: 'admin123',
        [field]: undefined as any,
      });

      expect(() => getConfig()).toThrow('Config validation error');
    });
  });

  it('should throw error for invalid values', () => {
    const invalidCases = [
      { ADMIN_EMAIL: 'invalid-email' },
      { ADMIN_PASSWORD: '123' },
      { NODE_ENV: 'invalid-env' },
      { PORT: 'invalid-port' },
    ];

    invalidCases.forEach((env) => {
      setEnv({
        JWT_SECRET: 'test-secret',
        ADMIN_EMAIL: 'admin@example.com',
        ADMIN_PASSWORD: 'admin123',
        ...env,
      });

      expect(() => getConfig()).toThrow('Config validation error');
    });
  });

  it('should be frozen and have correct structure', () => {
    setEnv({
      JWT_SECRET: 'test-secret',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'admin123',
    });

    const config = getConfig();

    expect(Object.isFrozen(config)).toBe(true);
    expect(config).toMatchObject({
      nodeEnv: expect.any(String),
      port: expect.any(Number),
      databaseUrl: expect.any(String),
      jwt: { secret: expect.any(String), expiresIn: expect.any(String) },
      admin: { email: expect.any(String), password: expect.any(String) },
    });
  });
});
