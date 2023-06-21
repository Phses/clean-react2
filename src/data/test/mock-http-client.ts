import { HttpPostClient, PostParams } from "@/data/protocols/http/http-post-client"
import { HttpResponse, HttpStatusCode } from "@/data/protocols/http/http-response"
import { AuthParams } from "@/domain/usecases/models/models"

export class HttpPostClientSpy implements HttpPostClient {
    url?: string
    body?: AuthParams
    response: HttpResponse = {
        StatusCode: HttpStatusCode.ok
    }
    post(params: PostParams): Promise<HttpResponse> {
        this.url = params.url
        this.body = params.body
        return Promise.resolve(this.response)
    }
}