import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleController } from '@/module/article/article.controller'
import { ArticleService } from '@/module/article/article.service'
import { TagEntity } from '@/entity/tag.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([TagEntity, ArticleEntity, UserEntity])],
	controllers: [ArticleController],
	providers: [ArticleService]
})
export class ArticleModule {}
