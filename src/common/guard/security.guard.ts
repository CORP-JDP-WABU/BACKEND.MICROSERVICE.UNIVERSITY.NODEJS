import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SecurityService } from '../client/security/security.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(
    private readonly securityService: SecurityService,
    private readonly cryptoService: CryptoService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    try {
        const decryptToken = await this.cryptoService.decrypt(token);
        const { idStudent } = await this.securityService.callFxValidateToken({ token: decryptToken });

        if(idStudent.length == 0) {
          throw new UnauthorizedException();
        }
        const configStudent = await this.securityService.callFxConfigStudent({ idStudent });
        request.userSession = {
          idStudent: configStudent._id,
          email: configStudent.email,
          idUniversity: configStudent.university._id
        }
      return true;
    } catch (error) {
      console.error("securityGuard:can-active:error",error)
      return false;
    }
  }
}