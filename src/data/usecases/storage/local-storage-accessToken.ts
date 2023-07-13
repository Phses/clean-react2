import { type SetStorage } from '@/data/protocols/storage/local-storage'
import { UnexpectedError } from '@/domain/erros'
import { type AccessTokenStorage } from '@/domain/usecases/local-storage/local-store-token'

export class AccessTokenLocalStorage implements AccessTokenStorage {
  constructor(private readonly setStorage: SetStorage) { }
  async save(accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new UnexpectedError()
    }
    await this.setStorage.set('accessToken', accessToken)
    await Promise.resolve()
  }
}
