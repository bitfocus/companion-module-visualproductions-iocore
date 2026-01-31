import { CompanionActionDefinition } from '@companion-module/base'
import { IoCoreInstance } from './main.js'

export function setupActions(instance: IoCoreInstance): void {
	const actions: { [id: string]: CompanionActionDefinition } = {
		gpoControl: {
			name: 'GPO Control',
			description: 'Switch the relay on GPO port',
			options: [
				{
					type: 'dropdown',
					label: 'GPO Port',
					id: 'port',
					default: 1,
					choices: [
						{ id: 1, label: 'Port 1' },
						{ id: 2, label: 'Port 2' },
						{ id: 3, label: 'Port 3' },
						{ id: 4, label: 'Port 4' },
						{ id: 5, label: 'Port 5' },
						{ id: 6, label: 'Port 6' },
					],
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					default: 1,
					choices: [
						{ id: 1, label: 'On' },
						{ id: 0, label: 'Off' },
					],
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-gpo-${action.options.port}=${action.options.state}`)
			},
		},
		actionListExecute: {
			name: 'Execute action',
			description: 'Execute a specific action inside an specific action list',
			options: [
				{
					type: 'dropdown',
					label: 'Action List',
					id: 'selectedActionList',
					default: 1,
					choices: [
						{ id: 1, label: 'Action List 1' },
						{ id: 2, label: 'Action List 2' },
						{ id: 3, label: 'Action List 3' },
						{ id: 4, label: 'Action List 4' },
						{ id: 5, label: 'Action List 5' },
						{ id: 6, label: 'Action List 6' },
						{ id: 7, label: 'Action List 7' },
						{ id: 8, label: 'Action List 8' },
					],
				},
				{
					type: 'number',
					label: 'Action',
					id: 'selectedAction',
					min: 1,
					max: 48,
					default: 1,
				},
				{
					type: 'textinput',
					label: 'Argument',
					id: 'targetArgument',
				},
			],
			callback: async (action) => {
				let arg = ''
				if (action.options.targetArgument) {
					arg = `=${action.options.targetArgument}`
				}
				instance.sendMessage(
					`core-al-${action.options.selectedActionList}-${action.options.selectedAction}-execute${arg}`,
				)
			},
		},
		actionListEnable: {
			name: 'Set action list state',
			description: 'Enable/Disable a specific action list',
			options: [
				{
					type: 'dropdown',
					label: 'Action List',
					id: 'selectedActionList',
					choices: [
						{ id: 1, label: 'Action List 1' },
						{ id: 2, label: 'Action List 2' },
						{ id: 3, label: 'Action List 3' },
						{ id: 4, label: 'Action List 4' },
						{ id: 5, label: 'Action List 5' },
						{ id: 6, label: 'Action List 6' },
						{ id: 7, label: 'Action List 7' },
						{ id: 8, label: 'Action List 8' },
					],
					default: 1,
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'selectedState',
					default: 'true',
					choices: [
						{ id: 'true', label: 'Enable' },
						{ id: 'false', label: 'Disable' },
					],
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-al-${action.options.selectedActionList}-enable=${action.options.selectedState}`)
			},
		},
		dmxControl: {
			name: 'DMX Control',
			description: 'Set the value of DMX channel',
			options: [
				{
					type: 'number',
					label: 'Channel',
					id: 'channel',
					min: 1,
					max: 512,
					default: 1,
				},
				{
					type: 'number',
					label: 'Value',
					id: 'value',
					min: 0,
					max: 255,
					default: 0,
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-dmx-${action.options.channel}=${action.options.value}`)
			},
		},
		timerState: {
			name: 'Set timer state',
			description: 'Start/Stop/Restart/Pause a timer',
			options: [
				{
					type: 'dropdown',
					label: 'Timer',
					id: 'selectedTimer',
					default: 1,
					choices: [
						{ id: 1, label: 'Timer 1' },
						{ id: 2, label: 'Timer 2' },
						{ id: 3, label: 'Timer 3' },
						{ id: 4, label: 'Timer 4' },
					],
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'selectedAction',
					default: 'start',
					choices: [
						{ id: 'start', label: 'Start' },
						{ id: 'stop', label: 'Stop' },
						{ id: 'restart', label: 'Restart' },
						{ id: 'pause', label: 'Pause' },
					],
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-tm-${action.options.selectedTimer}-${action.options.selectedAction}`)
			},
		},
		setTimerValue: {
			name: 'Set timer value',
			description: 'Set the value for a specific timer',
			options: [
				{
					type: 'dropdown',
					label: 'Timer',
					id: 'selectedTimer',
					default: 1,
					choices: [
						{ id: 1, label: 'Timer 1' },
						{ id: 2, label: 'Timer 2' },
						{ id: 3, label: 'Timer 3' },
						{ id: 4, label: 'Timer 4' },
					],
				},
				{
					type: 'textinput',
					label: 'Time',
					id: 'targetTime',
					default: '12:00:00:00',
					regex: instance.timecodeRegex,
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-tm-${action.options.selectedTimer}-set=${action.options.targetTime}`)
			},
		},
		setVariable: {
			name: 'Set variable value',
			description: 'Set the value for a specific variable',
			options: [
				{
					type: 'dropdown',
					label: 'Variable',
					id: 'selectedVariable',
					default: 1,
					choices: [
						{ id: 1, label: 'Variable 1' },
						{ id: 2, label: 'Variable 2' },
						{ id: 3, label: 'Variable 3' },
						{ id: 4, label: 'Variable 4' },
						{ id: 5, label: 'Variable 5' },
						{ id: 6, label: 'Variable 6' },
						{ id: 7, label: 'Variable 7' },
						{ id: 8, label: 'Variable 8' },
					],
				},
				{
					type: 'number',
					label: 'Value',
					id: 'targetValue',
					default: 1,
					min: 0,
					max: 10000,
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-va-${action.options.selectedVariable}-set=${action.options.targetValue}`)
			},
		},
		refreshVariable: {
			name: 'Refresh variable',
			description: 'Refresh a specific variable',
			options: [
				{
					type: 'dropdown',
					label: 'Variable',
					id: 'selectedVariable',
					default: 1,
					choices: [
						{ id: 1, label: 'Variable 1' },
						{ id: 2, label: 'Variable 2' },
						{ id: 3, label: 'Variable 3' },
						{ id: 4, label: 'Variable 4' },
						{ id: 5, label: 'Variable 5' },
						{ id: 6, label: 'Variable 6' },
						{ id: 7, label: 'Variable 7' },
						{ id: 8, label: 'Variable 8' },
					],
				},
			],
			callback: async (action) => {
				instance.sendMessage(`core-va-${action.options.selectedVariable}-refresh`)
			},
		},
		refreshAllVariables: {
			name: 'Refresh all variables',
			description: 'Refresh all variables',
			options: [],
			callback: async () => {
				instance.sendMessage('core-va-refresh')
			},
		},
		coreBlink: {
			name: 'Core blink',
			description: 'Momentarily flashes the IoCore LED',
			options: [],
			callback: async () => {
				instance.sendMessage('core-blink')
			},
		},
	}

	instance.setActionDefinitions(actions)
}
