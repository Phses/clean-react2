import { AuthAccount } from "@/domain/models";

export interface AccountStorage {
  save: (account: AuthAccount) => Promise<void>
}
