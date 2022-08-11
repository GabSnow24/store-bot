import { PromService } from '@digikare/nestjs-prom'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly promService: PromService
  constructor() {
    this.promService = new PromService()
  }
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.promService
            .getCounter({ name: 'node_timeout_connections', help: 'Metric for timeouted connections on server' })
            .inc(1)
          return throwError(() => new RequestTimeoutException())
        }
        return throwError(() => err)
      })
    )
  }
}
