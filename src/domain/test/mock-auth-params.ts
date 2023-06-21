import { AuthParams } from "@/domain/models"
import { faker } from "@faker-js/faker"

export const mockAuthParams = (): AuthParams => {
    return {
        email: faker.internet.email(),
        senha: faker.internet.password()
    }
}