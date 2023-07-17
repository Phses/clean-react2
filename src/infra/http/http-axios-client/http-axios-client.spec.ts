import { AxiosHttpClient } from './http-axios-client'
import { GetParams, type PostParams } from '@/data/protocols/http'
import { expect } from '@jest/globals'
import { getMockedAxios, mockResponse } from '../test/http/'
import { faker } from '@faker-js/faker'
import type axios from 'axios'

jest.mock('axios')

type SutType = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutType => {
  const sut = new AxiosHttpClient()
  const mockedAxios = getMockedAxios()
  return {
    sut,
    mockedAxios
  }
}

const mockPostParams = (): PostParams<any> => {
  return {
    url: faker.internet.url(),
    body: { prop1: faker.string.uuid() }
  }
}

const mockGetParams = (): GetParams => {
  return {
    url: faker.internet.url(),
  }
}

describe('axios client testes', () => {
  test('Deve chamar post com valores corretos', async () => {
    const { sut, mockedAxios } = makeSut()
    const mockedParams = mockPostParams()
    await sut.post(mockedParams)
    expect(mockedAxios.post).toBeCalledWith(mockedParams.url, mockedParams.body)
  })
  test('Deve retornar HttpResponse caso de post sucesso', async () => {
    const { sut, mockedAxios } = makeSut()
    const httpResponse = await sut.post(mockGetParams())
    const axiosResponse = await mockedAxios.post.mock.results[0].value
    expect(httpResponse).toEqual({
      StatusCode: axiosResponse.status,
      Body: axiosResponse.data
    })
  })
  test('Deve retornar erro correto em caso de post erro', async () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.post.mockRejectedValueOnce({
      response: mockResponse()
    })
    const promise = sut.post(mockPostParams())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
  test('Deve chamar get com url correta', async () => {
    const { sut, mockedAxios } = makeSut()
    const mockedParams = mockGetParams()
    await sut.get(mockedParams)
    expect(mockedAxios.get).toBeCalledWith(mockedParams.url)
  })
  test('Deve retornar HttpResponse caso de get sucesso', async () => {
    const { sut, mockedAxios } = makeSut()
    const httpResponse = await sut.get(mockGetParams())
    const axiosResponse = await mockedAxios.get.mock.results[0].value
    expect(httpResponse).toEqual({
      StatusCode: axiosResponse.status,
      Body: axiosResponse.data
    })
  })
  test('Deve retornar erro correto em caso de get erro', async () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.get.mockRejectedValueOnce({
      response: mockResponse()
    })
    const promise = sut.get(mockPostParams())
    expect(promise).toEqual(mockedAxios.get.mock.results[0].value)
  })
})
