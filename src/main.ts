import {
	InstanceBase,
	runEntrypoint,
	InstanceStatus,
	SomeCompanionConfigField,
	TCPHelper,
} from '@companion-module/base'
import { upgradeScripts } from './upgrade.js'
import { setupActions } from './actions.js'
import { setupFeedbacks } from './feedbacks.js'
import { setupPresets } from './presets.js'
import { configFields, ModuleConfig } from './config.js'

export class IoCoreInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	client: TCPHelper | null = null
	timecodeRegex = '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]:[0-5][0-9]$/'

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initPresets()

		await this.configUpdated(config)
	}

	initTCP(): void {
		if (this.client) {
			this.client.destroy()
			this.client = null
		}

		if (this.config.targetIp && this.config.targetPort) {
			this.client = new TCPHelper(this.config.targetIp, this.config.targetPort)

			this.client.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.client.on('error', (err) => {
				this.log('error', 'Network error: ' + err.message)
			})
			this.client.on('connect', () => {
				this.log('info', 'Connected to IoCore')
				this.sendMessage('core-hello')
			})
			this.client.on('data', (data) => {
				console.log(data)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'IoCore IP or Port is missing')
		}
	}

	async destroy(): Promise<void> {
		if (this.client) {
			this.client.destroy()
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.initTCP()
	}

	sendMessage(message: string): void {
		if (this.client) {
			void this.client.send(message)
		}
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return configFields
	}

	initFeedbacks(): void {
		setupFeedbacks(this)
	}

	initActions(): void {
		setupActions(this)
	}

	initPresets(): void {
		setupPresets(this)
	}
}

runEntrypoint(IoCoreInstance, upgradeScripts)
