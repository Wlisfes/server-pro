import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleController } from '@/module/admin/article/article.controller'
import { ArticleService } from '@/module/admin/article/article.service'
import { UtilsService } from '@/common/utils/utils.service'
import { TagEntity } from '@/entity/tag.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TagEntity, ArticleEntity, UserEntity])],
	controllers: [ArticleController],
	providers: [ArticleService, UtilsService]
})
export class ArticleModule {}
