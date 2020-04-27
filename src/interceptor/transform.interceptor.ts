import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import * as day from 'dayjs'

interface Response<T> {
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
		return next.handle().pipe(
			map(data => {
				return {
					data,
					code: HttpStatus.OK,
					message: '请求成功',
					timestamp: day().format('YYYY-MM-DD HH:mm:ss')
				}
			})
		)
	}
}
