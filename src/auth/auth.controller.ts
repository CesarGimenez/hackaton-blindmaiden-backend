import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthDto } from './dto/auth-dto';
import { getUser } from './decorators';
import { User } from 'src/modules/user/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth-decorator';
import { ValidRoles } from './interfaces';

const {SUPER } = ValidRoles;

ApiTags('Auth');
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    const { access_token } = await this.authService.login(user);
    return {
      user,
      access_token,
    };
  }

  @Post('/login')
  @ApiBody({ type: AuthDto })
  async login(@Body() authDto: AuthDto) {
    const { email, password } = authDto;
    const userFounded = await this.authService.findByEmail(email);

    if (
      !userFounded ||
      !this.authService.comparePasswords(password, userFounded.password)
    ) {
      throw new UnauthorizedException('usuario o contraseña incorrectos');
    }

    if (!userFounded.active) {
      throw new BadRequestException('usuario inactivo');
    }

    const { access_token } = await this.authService.login(userFounded);
    delete userFounded.password;
    return {
      message: 'login correcto',
      user: userFounded,
      access_token,
    };
  }

  @Get('me')
  // @Auth(ADMIN, SUPER, WAITER, KITCHEN)
  profile(@getUser() user: User) {
    return this.authService.getMe(user);
  }

  @Get('private')
  testingPrivateRoute(@getUser() user: User) {
    return {
      ok: true,
      message: 'private route',
      user,
    };
  }
}
