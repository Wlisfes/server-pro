import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//守卫
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guard/auth.guard'

//模块
import { UserModule } from '@/module/user/user.module'
import { RoleModule } from '@/module/role/role.module'
import { OssModule } from '@/module/oss/oss.module'
import { SignModule } from '@/module/sign/sign.module'
import { AuthModule } from '@/module/auth/auth.module'
import { StoreModule } from './module/store/store.module';

@Module({
	imports: [TypeOrmModule.forRoot(), OssModule, UserModule, RoleModule, SignModule, AuthModule, StoreModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
