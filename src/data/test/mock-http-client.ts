import { HttpPostClient, PostParams, HttpResponse, HttpStatusCode } from "@/data/protocols/http"

export class HttpPostClientSpy<T,R> implements HttpPostClient<T, R> {
    url?: string
    body?: T
    response: HttpResponse<R> = {
        StatusCode: HttpStatusCode.ok
    }
    post(params: PostParams<T>): Promise<HttpResponse<R>> {
        this.url = params.url
        this.body = params.body
        return Promise.resolve(this.response)
    }
}