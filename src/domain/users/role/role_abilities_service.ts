import { Role } from './role.ts'
import type { Ability } from './ability.ts'
import type { RoleAbilitiesPolicy } from './policies/role_abilities_policy.interface.ts'
import { AdminAbilitiesPolicy } from './policies/admin_abilities.policy.ts'
import { ManagerAbilitiesPolicy } from './policies/manager_abilities.policy.ts'
import { FinanceAbilitiesPolicy } from './policies/finance_abilities.policy.ts'
import { UserAbilitiesPolicy } from './policies/user_abilities.policy.ts'

const policies: Record<Role, RoleAbilitiesPolicy> = {
  [Role.ADMIN]: new AdminAbilitiesPolicy(),
  [Role.MANAGER]: new ManagerAbilitiesPolicy(),
  [Role.FINANCE]: new FinanceAbilitiesPolicy(),
  [Role.USER]: new UserAbilitiesPolicy(),
}

export class RoleAbilitiesService {
  static for(role: Role): Ability[] {
    return policies[role].getAbilities()
  }
}
