class remoteAuthentication {
    private url: string
    private httpPostClient: httpPostClient
    constructor(url: string, httpPostClient: httpPostClient) {
        this.url = url,
        this.httpPostClient = httpPostClient
    }
    async auth(): Promise<void> {
        await this.httpPostClient.post(this.url)
        return Promise.resolve()
    }
}

class httpPostClientSpy implements httpPostClient {
    url: string | undefined
    post(url: string): Promise<void> {
        this.url = url
        return Promise.resolve()
    }
}

interface httpPostClient {
    post(url: string): Promise<void>
}

describe("teste remote autentication", () => {
    test("deve chamar metodo com url correta", () => {
        const url = "any_url"
        const httpPostClient = new httpPostClientSpy()
        const sut = new remoteAuthentication(url, httpPostClient)
        sut.auth()
        expect(httpPostClient.url).toBe(url)
    })
})