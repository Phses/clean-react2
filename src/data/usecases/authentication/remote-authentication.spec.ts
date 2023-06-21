import { RemoteAuthentication } from "@/data/usecases/authentication/remote-authentication"
import { HttpPostClientSpy } from "@/data/test/mock-http-client"
import { mockAuthParams } from "@/domain/test/mock-auth-params";
import { HttpStatusCode } from "@/data/protocols/http/http-response";
import { InvalidCredentialsError } from "@/domain/erros/invalid-credential";
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
        await sut.auth(mockAuthParams())
        expect(httpPostClient.url).toBe(url)
    })
    test("deve chamar metodo com body correto", async () => {
        const {sut, httpPostClient} = makeSut()
        const authParams = mockAuthParams()
        await sut.auth(authParams)
        expect(httpPostClient.body).toEqual(authParams)
    })
    test("deve lançar invalidCredentialsException em caso de statusCode unauthorized", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.unauthorized
        const authParams = mockAuthParams()
        const promise = sut.auth(authParams)
        await expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })
})