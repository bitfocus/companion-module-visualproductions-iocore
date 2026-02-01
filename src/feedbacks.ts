import { IoCoreInstance } from './main.js'

export function setupFeedbacks(instance: IoCoreInstance): void {
	instance.setFeedbackDefinitions({
		gpiState: {
			type: 'boolean',
			name: 'GPI State',
			description: 'Check if GPI is in specific state',
			defaultStyle: {
				bgcolor: 0x009900,
				color: 0xffffff,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Port',
					id: 'port',
					default: 1,
					choices: [
						{ id: 1, label: '1' },
						{ id: 2, label: '2' },
						{ id: 3, label: '3' },
						{ id: 4, label: '4' },
						{ id: 5, label: '5' },
						{ id: 6, label: '6' },
						{ id: 7, label: '7' },
						{ id: 8, label: '8' },
					],
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					default: 'On',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
				},
			],
			callback: (feedback) => {
				const port = Number(feedback.options.port)
				const targetState = feedback.options.state
				return instance.state.gpi[port] === targetState
			},
		},
		gpoState: {
			type: 'boolean',
			name: 'GPO State',
			description: 'Check if GPO is in specific state',
			defaultStyle: {
				bgcolor: 0x009900,
				color: 0xffffff,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Port',
					id: 'port',
					default: 1,
					choices: [
						{ id: 1, label: '1' },
						{ id: 2, label: '2' },
						{ id: 3, label: '3' },
						{ id: 4, label: '4' },
						{ id: 5, label: '5' },
						{ id: 6, label: '6' },
						{ id: 7, label: '7' },
						{ id: 8, label: '8' },
					],
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					default: 'On',
					choices: [
						{ id: 'On', label: 'On' },
						{ id: 'Off', label: 'Off' },
					],
				},
			],
			callback: (feedback) => {
				const port = Number(feedback.options.port)
				const targetState = feedback.options.state === 'On' ? 1 : 0
				return instance.state.gpo[port] === targetState
			},
		},
	})
}
