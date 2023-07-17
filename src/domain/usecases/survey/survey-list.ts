import { type SurveyModel } from '@/domain/models'

export interface LoadSurvey {
  loadAll: () => Promise<SurveyModel[]>
}
