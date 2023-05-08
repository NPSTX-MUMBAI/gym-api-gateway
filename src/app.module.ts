import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { MemberModule } from './member/member.module';
import { PackageModule } from './package/package.module';
import { CollectionModule } from './collection/collection.module';
import { ReportsModule } from './reports/reports.module';
import { Neo4jModule } from '@brakebein/nest-neo4j';
import { GymModule } from './gym/gym.module';
import { BankModule } from './bank/bank.module';
import { ServicesModule } from './services/services.module';

/**
 * NEO4J_URI=neo4j+s://29959c44.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=lzpAnzMPt5DV_GG50IrFqqLocopsN95wguofamja-Es
AURA_INSTANCENAME=unacademy-db
*/

// port: 7687,
@Module({
  imports: [AuthModule,
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      host: '29959c44.databases.neo4j.io',
      port:7687,
      username: 'neo4j',
      password: 'lzpAnzMPt5DV_GG50IrFqqLocopsN95wguofamja-Es',
      options: {
        disableLosslessIntegers: true,
      },
    }),
    ServicesModule, OwnerModule, MemberModule, PackageModule, CollectionModule, ReportsModule, GymModule, BankModule],
  controllers: [AppController],
  providers: [AppService,],
})

export class AppModule { }
