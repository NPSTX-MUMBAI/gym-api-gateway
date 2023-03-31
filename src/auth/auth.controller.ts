import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {

  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() body: LoginDTO, @Request() req) {
    console.log(req);
    return await this.authSvc.login(req.user);
    //return req.user;
  }

  @Post('/signup')
  async signup(@Body() body: SignUpDTO) {
    return await this.authSvc.signup(body);
  }

  @Post("/validateuser")
  async signIn(@Body() body: LoginDTO) {
    return await this.authSvc.validateUser(body.email, body.password);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  resetPassword() {

  }

  logout() {

  }

}
