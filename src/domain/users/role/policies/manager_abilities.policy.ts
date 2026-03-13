import { Ability } from '../ability.ts'
import type { RoleAbilitiesPolicy } from './role_abilities_policy.interface.ts'

export class ManagerAbilitiesPolicy implements RoleAbilitiesPolicy {
  getAbilities(): Ability[] {
    return [Ability.USERS_ALL, Ability.SELF_READ, Ability.SELF_UPDATE, Ability.SELF_DELETE]
  }
}
