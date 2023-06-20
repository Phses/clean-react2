import { HttpPostClient, PostParams } from "data/protocols/http/http-post-client"
import { AuthParams } from "domain/usecases/models/models"

export class HttpPostClientSpy implements HttpPostClient {
    url?: string
    body?: AuthParams
    post(params: PostParams): Promise<void> {
        this.url = params.url
        this.body = params.body
        return Promise.resolve()
    }
}