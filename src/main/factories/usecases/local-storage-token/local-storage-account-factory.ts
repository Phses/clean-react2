import { LocalAccountStorage } from '@/data/usecases/storage/local-account-storage'
import { type AccountStorage } from '@/domain/usecases/local-storage/local-store-account'
import { makeSetStorage } from '../../cache/set-storage-cache'

export const makeLocalAccountStorage = (): AccountStorage => {
  return new LocalAccountStorage(makeSetStorage())
}
