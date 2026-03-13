import { Ability } from '../ability.ts'
import type { RoleAbilitiesPolicy } from './role_abilities_policy.interface.ts'

export class AdminAbilitiesPolicy implements RoleAbilitiesPolicy {
  getAbilities(): Ability[] {
    return [Ability.ALL]
  }
}
