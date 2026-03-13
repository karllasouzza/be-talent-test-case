import { Ability } from '../ability.ts'
import type { RoleAbilitiesPolicy } from './role_abilities_policy.interface.ts'

export class UserAbilitiesPolicy implements RoleAbilitiesPolicy {
  getAbilities(): Ability[] {
    return [Ability.SELF_READ, Ability.SELF_UPDATE, Ability.SELF_DELETE]
  }
}
