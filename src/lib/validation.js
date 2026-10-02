import { DOMAIN_CONTRACTS, ROLES, STATUS_GROUPS } from '../types/domain.js'

export function isValidValue(value, allowedValues) {
  return Array.isArray(allowedValues) && allowedValues.includes(value)
}

export function assertValidValue(value, allowedValues, fieldName = 'value') {
  if (!isValidValue(value, allowedValues)) {
    throw new TypeError(`${fieldName} is not a supported value`)
  }

  return value
}

export function isValidRole(role) {
  return isValidValue(role, DOMAIN_CONTRACTS.roles)
}

export function assertValidRole(role) {
  return assertValidValue(role, DOMAIN_CONTRACTS.roles, 'role')
}

export function isValidStatus(groupName, status) {
  return isValidValue(status, STATUS_GROUPS[groupName])
}

export function assertValidStatus(groupName, status) {
  const allowedStatuses = STATUS_GROUPS[groupName]

  if (!allowedStatuses) {
    throw new RangeError(`Unknown status group: ${groupName}`)
  }

  return assertValidValue(status, allowedStatuses, `${groupName} status`)
}

export function isValidContractValue(contractName, value) {
  return isValidValue(value, DOMAIN_CONTRACTS[contractName])
}

export function assertValidContractValue(contractName, value) {
  const allowedValues = DOMAIN_CONTRACTS[contractName]

  if (!allowedValues) {
    throw new RangeError(`Unknown contract: ${contractName}`)
  }

  return assertValidValue(value, allowedValues, contractName)
}

export { ROLES, STATUS_GROUPS }
