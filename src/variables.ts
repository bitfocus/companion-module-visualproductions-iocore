import { CompanionVariableDefinition } from '@companion-module/base'
import { IoCoreInstance } from './main.js'

export function setupVariables(instance: IoCoreInstance): void {
	const variables: CompanionVariableDefinition[] = [
		{ variableId: 'uptime', name: 'Uptime' },
		{ variableId: 'label', name: 'Device Label' },
	]

	for (let i = 1; i <= 8; i++) {
		variables.push({ variableId: `gpi_${i}`, name: `GPI ${i} State` })
		variables.push({ variableId: `gpi_${i}_name`, name: `GPI ${i} Name` })
		variables.push({ variableId: `gpo_${i}`, name: `GPO ${i} State` })
		variables.push({ variableId: `gpo_${i}_name`, name: `GPO ${i} Name` })
	}

	instance.setVariableDefinitions(variables)
}
