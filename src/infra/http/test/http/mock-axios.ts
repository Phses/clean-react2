import { faker } from '@faker-js/faker'
import axios from 'axios'

export const mockResponse = (): any => ({
  data: { prop1: faker.string.uuid() },
  status: faker.number.int(3)
})

export const getMockedAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  mockedAxios.post.mockClear().mockResolvedValue(mockResponse())
  mockedAxios.get.mockClear().mockResolvedValue(mockResponse())
  return mockedAxios
}
