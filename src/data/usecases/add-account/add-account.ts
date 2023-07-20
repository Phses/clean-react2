
import { type HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/erros'
import { EmailInUseError } from '@/domain/erros/email-in-use-error'
import { type AccountParams, type AuthAccount } from '@/domain/models'

export class RemoteAddAccount {
  private readonly url: string
  private readonly httpPostClient: HttpPostClient<AccountParams, AuthAccount>
  constructor(url: string, httpPostClient: HttpPostClient<AccountParams, AuthAccount>) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async add(params: AccountParams): Promise<AuthAccount> {
    const response = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (response.StatusCode) {
      case (HttpStatusCode.ok):
        return response.Body
      case (HttpStatusCode.forbbiden):
        throw new EmailInUseError()
      default:
        throw new UnexpectedError()
    }
  }
}
