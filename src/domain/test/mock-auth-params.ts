import { faker } from "@faker-js/faker"
import { AuthParams } from "@/domain/models/auth-models"

export const mockAuthParams = (): AuthParams => {
    return {
        email: faker.internet.email(),
        senha: faker.internet.password()
    }
}