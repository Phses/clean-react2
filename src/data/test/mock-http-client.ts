import { type HttpPostClient, type PostParams, type HttpResponse, HttpStatusCode, HttpGetClient, GetParams } from '@/data/protocols/http'

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string
  body?: T
  response: HttpResponse<R> = {
    StatusCode: HttpStatusCode.ok
  }

  async post(params: PostParams<T>): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params.body
    return await Promise.resolve(this.response)
  }
}

export class HttpGetClientSpy<T> implements HttpGetClient<T> {
  url: string
  response: HttpResponse<any> = {
    StatusCode: HttpStatusCode.ok
  }
  async get(params: GetParams): Promise<HttpResponse<any>> {
    this.url = params.url
    return await Promise.resolve(this.response)
  }
}
