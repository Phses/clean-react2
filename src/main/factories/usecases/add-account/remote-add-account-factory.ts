import { makeHttpClient } from '../../http/http-client-factory'
import { makeUrl } from '@/main/factories/http/http-url-factory'
import { RemoteAddAccount } from '@/data/usecases/add-account'
import { type AddAccount } from '@/domain/usecases/add-account/add-account'

export const makeRemoteAddAccount = (): AddAccount => {
  const url = makeUrl('/cadastro')
  return new RemoteAddAccount(url, makeHttpClient())
}
