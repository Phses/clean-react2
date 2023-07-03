
import { type HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/erros'
import { EmailInUseError } from '@/domain/erros/email-in-use-error'
import { type AccountParams, type AuthToken } from '@/domain/models'

export class RemoteAddAccount {
  private readonly url: string
  private readonly httpPostClient: HttpPostClient<AccountParams, AuthToken>
  constructor(url: string, httpPostClient: HttpPostClient<AccountParams, AuthToken>) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async add(params: AccountParams): Promise<AuthToken> {
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
