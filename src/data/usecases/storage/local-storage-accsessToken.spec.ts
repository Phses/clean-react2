import { SetStorageSpy } from '@/data/test/mock-storage'
import { faker } from '@faker-js/faker'
import { expect } from '@jest/globals'
import { AccessTokenLocalStorage } from './local-storage-accessToken'
import { UnexpectedError } from '@/domain/erros'

type SutTypes = {
  sut: AccessTokenLocalStorage
  setStorage: SetStorageSpy
}

const makeSut = (): SutTypes => {
  const setStorage = new SetStorageSpy()
  const sut = new AccessTokenLocalStorage(setStorage)
  return ({
    sut,
    setStorage
  })
}

describe('Local storage', () => {
  test('Deve chamar setStorage com dados corretos', async () => {
    const { sut, setStorage } = makeSut()
    const accessToken = faker.string.uuid()
    await sut.save(accessToken)
    expect(setStorage.key).toBe('accessToken')
    expect(setStorage.value).toBe(accessToken)
  })
  test('Deve passar por unexpectedError caso token invalido', async () => {
    const { sut, setStorage } = makeSut()
    const accessToken = undefined
    const promise = sut.save(accessToken)

    await expect(promise).rejects.toThrow(UnexpectedError)
  })
  // test('Deve passar por erro caso setStorage passe', async () => {
  //     const { sut, setStorage } = makeSut();
  //     const error = new Error('Mocked error');
  //     jest.spyOn(setStorage, 'set').mockRejectedValueOnce(error);

  //     const accessToken = faker.string.uuid();
  //     const promise = sut.save(accessToken);

  //     await expect(promise).rejects.toThrow(error);
  // })
})
