import { SetStorageSpy } from '@/data/test/mock-storage'
import { faker } from '@faker-js/faker'
import { expect } from '@jest/globals'
import { LocalAccountStorage } from './local-account-storage'
import { UnexpectedError } from '@/domain/erros'

type SutTypes = {
  sut: LocalAccountStorage
  setStorage: SetStorageSpy
}

const makeSut = (): SutTypes => {
  const setStorage = new SetStorageSpy()
  const sut = new LocalAccountStorage(setStorage)
  return ({
    sut,
    setStorage
  })
}

describe('Local storage', () => {
  test('Deve chamar setStorage com dados corretos', async () => {
    const { sut, setStorage } = makeSut()
    const account = {
      token: faker.string.uuid(),
      name: faker.person.fullName()
    }
    await sut.save(account)
    expect(setStorage.key).toBe('account')
    expect(setStorage.value).toBe(JSON.stringify(account))
  })
  test('Deve passar por unexpectedError caso token invalido', async () => {
    const { sut } = makeSut()
    const account = undefined
    const promise = sut.save(account)

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
