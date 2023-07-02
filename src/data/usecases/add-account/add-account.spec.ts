import { UnexpectedError } from "@/domain/erros/";
import { AccountParams, AuthToken } from "@/domain/models/";
import { HttpStatusCode } from "@/data/protocols/http/";
import { HttpPostClientSpy } from "@/data/test/"
import { faker } from '@faker-js/faker';
import { mockAccountParams } from "@/domain/test/mock-account-params";
import { RemoteAddAccount } from "./add-account";
import { EmailInUseError } from "@/domain/erros/email-in-use-error";


type sutTypes = {
    httpPostClient: HttpPostClientSpy<AccountParams, AuthToken>
    sut: RemoteAddAccount
}

const makeSut = (url: string = faker.internet.url()): sutTypes => {
    const httpPostClient = new HttpPostClientSpy<AccountParams,AuthToken>()
    const sut = new RemoteAddAccount(url, httpPostClient)
    return {
        httpPostClient,
        sut
    }
}
describe("Teste RemoteAddAccount", () => {
    test("Deve chamar metodo com url correta", async () => {
        const url = faker.internet.url()
        const {sut, httpPostClient} = makeSut(url)
        await sut.add(mockAccountParams())
        expect(httpPostClient.url).toBe(url)
    })
    test("Deve chamar metodo com body correto", async () => {
        const {sut, httpPostClient} = makeSut()
        const accountParams = mockAccountParams()
        await sut.add(accountParams)
        expect(httpPostClient.body).toEqual(accountParams)
    })
    test("Deve lançar EmailInUseException em caso de statusCode 403", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.forbbiden
        const accountParams = mockAccountParams()
        const promise = sut.add(accountParams)
        await expect(promise).rejects.toThrow(new EmailInUseError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 400", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.badRequest
        const accountParams = mockAccountParams()
        const promise = sut.add(accountParams)
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 404", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.notFound
        const accountParams = mockAccountParams()
        const promise = sut.add(accountParams)
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    test("Deve lançar UnexpectedException em caso de statusCode 500", async () => {
        const {sut, httpPostClient} = makeSut()
        httpPostClient.response.StatusCode = HttpStatusCode.serverError
        const accountParams = mockAccountParams()
        const promise = sut.add(accountParams)
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
        const accountParams = mockAccountParams()
        const authToken = await sut.add(accountParams)
        expect(authToken).toEqual(bodyResponse)
    })
})