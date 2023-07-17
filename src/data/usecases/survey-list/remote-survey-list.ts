import { HttpGetClient, HttpStatusCode } from "@/data/protocols/http";
import { UnexpectedError } from "@/domain/erros";
import { SurveyModel } from "@/domain/models";
import { LoadSurvey } from "@/domain/usecases/survey/survey-list";

export class RemoteLoadSurveyList implements LoadSurvey {
  constructor(private readonly url: string, private readonly httpGetClient: HttpGetClient<SurveyModel[]>) { }
  async loadAll(): Promise<SurveyModel[]> {
    const response = await this.httpGetClient.get({ url: this.url })
    switch (response.StatusCode) {
      case (HttpStatusCode.ok):
        return response.Body
      case (HttpStatusCode.noContent):
        return []
      default:
        throw new UnexpectedError()
    }
  }
}