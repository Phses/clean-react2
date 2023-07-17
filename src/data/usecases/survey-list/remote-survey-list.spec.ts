import { HttpGetClientSpy } from "@/data/test"
import { SurveyModel } from "@/domain/models"
import { LoadSurvey } from "@/domain/usecases/survey/survey-list"
import { faker } from "@faker-js/faker"
import { expect } from '@jest/globals'
import { RemoteLoadSurveyList } from "./remote-survey-list"
import { HttpStatusCode } from "@/data/protocols/http"
import { UnexpectedError } from "@/domain/erros"
import { mockSurveyList } from "@/domain/test"

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClient: HttpGetClientSpy<SurveyModel[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClient = new HttpGetClientSpy()
  const sut = new RemoteLoadSurveyList(url, httpGetClient)
  return {
    sut,
    httpGetClient
  }
}

describe('Teste load survey list', () => {
  test('Deve chamar HttpGetClient com url correta', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClient } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClient.url).toBe(url)
  })
  test('Deve lançar UnexpectedError em caso de statusCode 403', async () => {
    const { sut, httpGetClient } = makeSut()
    httpGetClient.response.StatusCode = HttpStatusCode.forbbiden
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Deve lançar UnexpectedError em caso de statusCode 404', async () => {
    const { sut, httpGetClient } = makeSut()
    httpGetClient.response.StatusCode = HttpStatusCode.notFound
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Deve lançar UnexpectedError em caso de statusCode 500', async () => {
    const { sut, httpGetClient } = makeSut()
    httpGetClient.response.StatusCode = HttpStatusCode.serverError
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Deve retornar SurveyList em caso de statusCode 200', async () => {
    const { sut, httpGetClient } = makeSut()
    const response = mockSurveyList()
    httpGetClient.response = {
      StatusCode: HttpStatusCode.ok,
      Body: response
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual(response)
  })
  test('Deve retornar uma lista vazia em caso de statusCode 204', async () => {
    const { sut, httpGetClient } = makeSut()
    httpGetClient.response = {
      StatusCode: HttpStatusCode.noContent,
      Body: []
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual([])
  })
})