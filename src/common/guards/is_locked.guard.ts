import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class IsLockedGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const freshUser = await this.userService.findOne(String(user.sub));
    if (freshUser.is_locked) throw new UnauthorizedException('Compte bloqué');

    return true;
  }
}
