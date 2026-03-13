import { Ability } from '../ability.ts'
import type { RoleAbilitiesPolicy } from './role_abilities_policy.interface.ts'

export class FinanceAbilitiesPolicy implements RoleAbilitiesPolicy {
  getAbilities(): Ability[] {
    return [Ability.USERS_READ, Ability.SELF_READ, Ability.SELF_UPDATE]
  }
}
