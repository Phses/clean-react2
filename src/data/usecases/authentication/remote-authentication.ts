import { HttpPostClient } from "@/data/protocols/http/http-post-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { InvalidCredentialsError } from "@/domain/erros/invalid-credential"
import { AuthParams } from "@/domain/usecases/models/models"

export class RemoteAuthentication {
    private url: string
    private httpPostClient: HttpPostClient
    constructor(url: string, httpPostClient: HttpPostClient) {
        this.url = url,
        this.httpPostClient = httpPostClient
    }
    async auth(params: AuthParams): Promise<void> {
        const response = await this.httpPostClient.post({
            url: this.url,
            body: params
        })
        switch(response.StatusCode){
            case(HttpStatusCode.unauthorized):
                throw new InvalidCredentialsError()
            default:
                return Promise.resolve()
        }
    }
}