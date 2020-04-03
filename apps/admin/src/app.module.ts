import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbModule } from 'libs/db/src'
import { UserModule } from './user/user.module';

@Module({
	imports: [DbModule, UserModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
