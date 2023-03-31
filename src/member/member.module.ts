import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule { }
