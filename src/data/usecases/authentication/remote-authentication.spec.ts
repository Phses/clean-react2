import { RemoteAuthentication } from "."
import { mockAuthParams } from "@/domain/test/";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/erros/";
import { AuthParams, AuthToken } from "@/domain/models/";
import { HttpStatusCode } from "@/data/protocols/http/";
import { HttpPostClientSpy } from "@/data/test/"
import { faker } from '@faker-js/faker';

type sutTypes = {
    httpPostClient: HttpPostClientSpy<AuthParams, AuthToken>
    sut: RemoteAuthentication
}

const makeSut = (url: string = faker.internet.url()): sutTypes => {
    const httpPostClient = new HttpPostClientSpy<AuthParams,AuthToken>()
    const sut = new RemoteAuthentication(url, httpPostClient)
    return {
        httpPostClient,
        sut
    }
}
describe("Teste remoteAutentication", () => {
    test("Deve chamar metodo com url correta", async () => {
        const url = faker.internet.url()
        const {sut, httpPostClient} = makeSut(url)
        await sut.auth(mockAuthParams())
        expect(httpPostClient.url).toBe(url)
    })
    test("Deve chamar metodo com body correto", async () => {
        const {sut, httpPostClient} = makeSut()
        const authParams = mockAuthParams()
        await sut.auth(authParams)
        expect(httpPostClient.body).toEqual(authParams)
    })
    test("Deve lançar invalidCredentialsException em caso de statusCode 401", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.unauthorized
        const authParams = mockAuthParams()
        const promise = sut.auth(authParams)
        await expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 400", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.badRequest
        const authParams = mockAuthParams()
        const promise = sut.auth(authParams)
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 404", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.notFound
        const authParams = mockAuthParams()
        const promise = sut.auth(authParams)
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 500", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.serverError
        const authParams = mockAuthParams()
        const promise = sut.auth(authParams)
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    test("Deve retornar AuthToken em caso de statusCode 200", async () => {
        const {sut, httpPostClient} = makeSut()
        const bodyResponse = {
            token: faker.string.uuid()
        }
        httpPostClient.response = {
            StatusCode: HttpStatusCode.ok,
            Body: bodyResponse
        }
        const authParams = mockAuthParams()
        const authToken = await sut.auth(authParams)
        expect(authToken).toEqual(bodyResponse)
    })
})