import { HttpPostClient } from "data/protocols/http/http-post-client"

export class HttpPostClientSpy implements HttpPostClient {
    url: string | undefined
    post(url: string): Promise<void> {
        this.url = url
        return Promise.resolve()
    }
}