import { RemoteAuthentication } from "./remote-authentication"
import { HttpPostClientSpy } from "../../test/mock-http-client"

type sutTypes = {
    httpPostClient: HttpPostClientSpy
    sut: RemoteAuthentication
}

const makeSut = (url: string = "any_url"): sutTypes => {
    const httpPostClient = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClient)
    return {
        httpPostClient,
        sut
    }
}
describe("teste remote autentication", () => {
    test("deve chamar metodo com url correta", async () => {
        const url = "other_url"
        const {sut, httpPostClient} = makeSut(url)
        await sut.auth()
        expect(httpPostClient.url).toBe(url)
    })
})