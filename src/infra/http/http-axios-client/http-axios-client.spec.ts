import { AxiosHttpClient } from './http-axios-client'
import { PostParams } from '@/data/protocols/http'
import { faker } from '@faker-js/faker'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const mockAxiosResponse = {
    data: {prop1: faker.string.uuid()},
    status: faker.number.int(3)
}
mockedAxios.post.mockResolvedValue(mockAxiosResponse)

const getParams = (): PostParams<any> => { 
    return {
        url: faker.internet.url(),
        body: {prop1: faker.string.uuid()}
    }
}

describe("axios client testes", () => {
    test("Deve chamar post com valores corretos", async () => {
        const sut = new AxiosHttpClient()
        const mockedParams = getParams()
        await sut.post(mockedParams)
        expect(mockedAxios.post).toBeCalledWith(mockedParams.url, mockedParams.body)
    })
    test("Deve retornar HttpResponse", async () => {
        const sut = new AxiosHttpClient()
        const response = await sut.post(getParams())
        expect(response).toEqual({
            StatusCode: mockAxiosResponse.status,
            Body: mockAxiosResponse.data
        })
    })
})