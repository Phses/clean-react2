import { faker } from "@faker-js/faker"
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from "./local-storage-adapter"



describe('Teste set storage', () => {
    beforeEach(() => {
        localStorage.clear()
    })
    test('Deve chamar local storage com valores corretos', () => {
        const sut = new LocalStorageAdapter()
        const key = faker.database.column()
        const value = faker.string.uuid()
        sut.set(key, value)
        expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
    })
})