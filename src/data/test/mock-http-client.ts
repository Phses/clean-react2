import { HttpPostClient, PostParams } from "@/data/protocols/http/http-post-client"
import { HttpResponse, HttpStatusCode } from "@/data/protocols/http/http-response"
import { AuthParams } from "@/domain/usecases/models/models"

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