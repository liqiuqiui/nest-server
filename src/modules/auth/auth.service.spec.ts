import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('admin login should be successed', async () => {
    const loginres = await service.adminLogin({
      username: 'admin',
      password: '12345',
    });
    expect(loginres.token).toHaveProperty(['token', 'admin']);
    expect(loginres.admin.role).toBe(0);
  });
});
