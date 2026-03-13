import type { Ability } from '../ability.ts'

export interface RoleAbilitiesPolicy {
  getAbilities(): Ability[]
}
