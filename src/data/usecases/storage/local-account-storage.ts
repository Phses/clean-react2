import { type SetStorage } from '@/data/protocols/storage/local-storage'
import { UnexpectedError } from '@/domain/erros'
import { AuthAccount } from '@/domain/models'
import { type AccountStorage } from '@/domain/usecases/local-storage/local-store-account'

export class LocalAccountStorage implements AccountStorage {
  constructor(private readonly setStorage: SetStorage) { }
  async save(account: AuthAccount): Promise<void> {
    if (account === undefined || !account.token || !account.name) {
      throw new UnexpectedError()
    }
    await this.setStorage.set('account', JSON.stringify(account))
  }
}
