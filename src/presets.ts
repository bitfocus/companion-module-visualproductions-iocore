import { CompanionPresetDefinitions } from '@companion-module/base'
import type { IoCoreInstance } from './main.js'

export function setupPresets(instance: IoCoreInstance): void {
	const presets: CompanionPresetDefinitions = {}

	const Color = {
		black: 0x000000,
		white: 0xffffff,
		red: 0xda2f21,
		green: 0x009900,
	}

	const controlActions = [
		{ id: 'start', label: 'Start' },
		{ id: 'stop', label: 'Stop' },
		{ id: 'restart', label: 'Restart' },
		{ id: 'pause', label: 'Pause' },
	]

	for (let i = 1; i <= 4; i++) {
		presets[`timer_${i}_header`] = {
			type: 'text',
			category: 'Timers',
			name: 'Timer ' + i,
			text: '',
		}
		for (const action of controlActions) {
			presets[`timer_${i}_${action.id}`] = {
				type: 'button',
				category: 'Timers',
				name: action.label,
				options: {},
				style: {
					text: action.label + ' Timer ' + i,
					size: '14',
					color: Color.white,
					bgcolor: Color.black,
				},
				steps: [
					{
						down: [
							{
								actionId: 'timerState',
								options: {
									selectedTimer: i,
									selectedAction: action.id,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}

	presets[`blink`] = {
		type: 'button',
		category: 'Utility',
		name: 'Blink',
		options: {},
		style: {
			text: 'Blink',
			size: '14',
			color: Color.white,
			bgcolor: Color.black,
		},
		steps: [
			{
				down: [
					{
						actionId: 'coreBlink',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	for (let i = 1; i <= 6; i++) {
		presets[`gpo_${i}_on`] = {
			type: 'button',
			category: 'GPO',
			name: 'GPO ' + i + ' On',
			options: {},
			style: {
				text: 'GPO ' + i + ' On',
				size: '14',
				color: Color.white,
				bgcolor: Color.black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'gpoControl',
							options: {
								port: i,
								state: 1,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets[`gpo_${i}_off`] = {
			type: 'button',
			category: 'GPO',
			name: 'GPO ' + i + ' Off',
			options: {},
			style: {
				text: 'GPO ' + i + ' Off',
				size: '14',
				color: Color.white,
				bgcolor: Color.black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'gpoControl',
							options: {
								port: i,
								state: 0,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}
	instance.setPresetDefinitions(presets)
}
