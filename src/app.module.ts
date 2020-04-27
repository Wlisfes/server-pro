import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './module/common/common.module'
import { UserModule } from './module/user/user.module'
import { RoleModule } from './module/role/role.module'
import { SignModule } from './module/sign/sign.module'
import { StoreModule } from './module/store/store.module'
import { AuthModule } from './module/auth/auth.module'

@Module({
	imports: [CommonModule, UserModule, RoleModule, AuthModule, SignModule, StoreModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
