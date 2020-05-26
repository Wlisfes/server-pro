import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import * as day from 'dayjs'

interface MapResult<T> {
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, MapResult<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<MapResult<T>> {
		return next.handle().pipe(
			map(data => {
				return {
					data: data || null,
					code: HttpStatus.OK,
					message: '请求成功',
					timestamp: day().format('YYYY-MM-DD HH:mm:ss')
				}
			})
		)
	}
}
