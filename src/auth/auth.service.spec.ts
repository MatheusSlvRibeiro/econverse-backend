import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  };
  let jwtService: { sign: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    };
    jwtService = {
      sign: vi.fn().mockReturnValue('signed-jwt'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('hashes the password, creates the user and returns a token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', email: 'admin@example.com' });

      const result = await service.register({ email: 'admin@example.com', password: 'supersecret' });

      expect(result).toEqual({ accessToken: 'signed-jwt' });
      const createArgs = prisma.user.create.mock.calls[0][0];
      expect(createArgs.data.email).toBe('admin@example.com');
      expect(createArgs.data.passwordHash).not.toBe('supersecret');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', email: 'admin@example.com' });
    });

    it('throws ConflictException when the email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'admin@example.com' });

      await expect(
        service.register({ email: 'admin@example.com', password: 'supersecret' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns a token when credentials are valid', async () => {
      const passwordHash = await bcrypt.hash('supersecret', 10);
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'admin@example.com', passwordHash });

      const result = await service.login({ email: 'admin@example.com', password: 'supersecret' });

      expect(result).toEqual({ accessToken: 'signed-jwt' });
    });

    it('throws UnauthorizedException when the email does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'missing@example.com', password: 'supersecret' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password is wrong', async () => {
      const passwordHash = await bcrypt.hash('supersecret', 10);
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'admin@example.com', passwordHash });

      await expect(
        service.login({ email: 'admin@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
