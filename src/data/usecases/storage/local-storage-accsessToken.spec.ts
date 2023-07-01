import { SetStorageSpy } from "@/data/test/mock-storage"
import { faker } from "@faker-js/faker"
import { AccessTokenLocalStorage } from "./local-storage-accessToken"
import { SetStorage } from "@/data/protocols/storage/local-storage"

type SutTypes = {
    sut: AccessTokenLocalStorage,
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
    test('Deve chamar setStorage com dados corretos', () => {
        const { sut, setStorage } = makeSut()
        const accessToken = faker.string.uuid()
        sut.save(accessToken)
        expect(setStorage.key).toBe('accessToken')
        expect(setStorage.value).toBe(accessToken)
    })
})