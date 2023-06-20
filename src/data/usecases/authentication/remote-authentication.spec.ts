import { RemoteAuthentication } from "./remote-authentication"
import { HttpPostClientSpy } from "../../test/mock-http-client"
import { faker } from '@faker-js/faker';

type sutTypes = {
    httpPostClient: HttpPostClientSpy
    sut: RemoteAuthentication
}

const makeSut = (url: string = faker.internet.url()): sutTypes => {
    const httpPostClient = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClient)
    return {
        httpPostClient,
        sut
    }
}
describe("teste remote autentication", () => {
    test("deve chamar metodo com url correta", async () => {
        const url = faker.internet.url()
        const {sut, httpPostClient} = makeSut(url)
        await sut.auth()
        expect(httpPostClient.url).toBe(url)
    })
})