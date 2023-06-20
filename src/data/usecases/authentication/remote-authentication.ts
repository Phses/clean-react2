import { HttpPostClient } from "data/protocols/http/http-post-client"
import { AuthParams } from "domain/usecases/models/models"

export class RemoteAuthentication {
    private url: string
    private httpPostClient: HttpPostClient
    constructor(url: string, httpPostClient: HttpPostClient) {
        this.url = url,
        this.httpPostClient = httpPostClient
    }
    async auth(params: AuthParams): Promise<void> {
        await this.httpPostClient.post({
            url: this.url,
            body: params
        })
        return Promise.resolve()
    }
}