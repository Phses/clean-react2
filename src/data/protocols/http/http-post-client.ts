import { type HttpResponse } from '.'

export type PostParams<T> = {
  url: string
  body?: T
}

export interface HttpPostClient<T, R> {
  post: (params: PostParams<T>) => Promise<HttpResponse<R>>
}
