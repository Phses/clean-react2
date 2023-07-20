import { AccountParams, AuthAccount } from '@/domain/models'
import { type AccountStorage } from '@/domain/usecases/local-storage/local-store-account'

export class LocalAccountStorageMock implements AccountStorage {
  account: AuthAccount
  async save(account: AuthAccount): Promise<void> {
    this.account = account
    await Promise.resolve()
  }
}
