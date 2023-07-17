import { SurveyModel, type AccountParams } from '@/domain/models'
import { faker } from '@faker-js/faker'

export const mockSurveyList = (): SurveyModel[] => ([{
  id: faker.string.uuid(),
  question: faker.lorem.words(10),
  answers: [{
    answer: faker.lorem.words(4),
    image: faker.internet.url()
  }],
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent()
}])
