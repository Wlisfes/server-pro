import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagController } from '@/module/admin/tag/tag.controller'
import { TagService } from '@/module/admin/tag/tag.service'
import { TagEntity } from '@/entity/tag.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, TagEntity, ArticleEntity])],
	controllers: [TagController],
	providers: [TagService]
})
export class TagModule {}
