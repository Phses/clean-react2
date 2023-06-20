import { RemoteAuthentication } from "./remote-authentication"
import { HttpPostClientSpy } from "../../test/mock-http-client"
import { faker } from '@faker-js/faker';
import { mockAuthParams } from "../../../domain/test/mock-auth-params";

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
        await sut.auth(mockAuthParams())
        expect(httpPostClient.url).toBe(url)
    })
    test("deve chamar metodo com body correto", async () => {
        const {sut, httpPostClient} = makeSut()
        const authParams = mockAuthParams()
        await sut.auth(authParams)
        expect(httpPostClient.body).toEqual(authParams)
    })
})