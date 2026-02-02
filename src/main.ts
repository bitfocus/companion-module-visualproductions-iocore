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
import { setupVariables } from './variables.js'
import { configFields, ModuleConfig } from './config.js'

interface IoCoreState {
	gpi: boolean[]
	gpo: number[]
	uptime: number
	label: string
	serial: string
	firmware: string
	ip: string
	netmask: string
	gateway: string
	mac: string
	time: string
	date: string
}

export class IoCoreInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	client: TCPHelper | null = null
	pollingInterval: NodeJS.Timeout | null = null
	timecodeRegex = '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]:[0-5][0-9]$/'

	state: IoCoreState = {
		gpi: new Array(9).fill(false),
		gpo: new Array(9).fill(0),
		uptime: 0,
		label: '',
		serial: '',
		firmware: '',
		ip: '',
		netmask: '',
		gateway: '',
		mac: '',
		time: '',
		date: '',
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initPresets()
		this.initVariables()

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
			this.client.on('data', (_data) => {
				//console.log(data)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'IoCore IP or Port is missing')
		}
	}

	async destroy(): Promise<void> {
		if (this.client) {
			this.client.destroy()
		}
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
		}
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.initTCP()
		this.initPolling()
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

	initVariables(): void {
		setupVariables(this)
	}

	initPolling(): void {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
		}

		if (this.config.targetIp) {
			this.pollingInterval = setInterval(() => {
				void this.pollStatus()
			}, 500)
		}
	}

	async pollStatus(): Promise<void> {
		try {
			const response = await fetch(`http://${this.config.targetIp}/ajax/get/index/status`)
			if (response.ok) {
				const data = (await response.json()) as any
				//console.log(data)
				const variableUpdates: { [key: string]: any } = {}
				let checkFeedbacks = false

				// System Info
				if (this.state.uptime !== data.gen.upt) {
					this.state.uptime = data.gen.upt
					variableUpdates['uptime'] = data.gen.upt
				}
				if (this.state.label !== data.gen.lbl) {
					this.state.label = data.gen.lbl
					variableUpdates['label'] = data.gen.lbl
				}
				if (this.state.serial !== data.gen.serial) {
					this.state.serial = data.gen.serial
					variableUpdates['serial'] = data.gen.serial
				}
				if (this.state.firmware !== data.gen.fw.toFixed(2)) {
					this.state.firmware = data.gen.fw.toFixed(2)
					variableUpdates['firmware'] = this.state.firmware
				}

				// Network Info
				if (this.state.ip !== data.ip.ip) {
					this.state.ip = data.ip.ip
					variableUpdates['ip'] = data.ip.ip
				}
				if (this.state.netmask !== data.ip.sn) {
					this.state.netmask = data.ip.sn
					variableUpdates['netmask'] = data.ip.sn
				}
				if (this.state.gateway !== data.ip.r) {
					this.state.gateway = data.ip.r
					variableUpdates['gateway'] = data.ip.r
				}
				if (this.state.mac !== data.ip.mac) {
					this.state.mac = data.ip.mac
					variableUpdates['mac'] = data.ip.mac
				}

				// Time Info
				if (this.state.time !== data.time.t) {
					this.state.time = data.time.t
					variableUpdates['time'] = data.time.t
				}
				if (this.state.date !== data.time.d) {
					this.state.date = data.time.d
					variableUpdates['date'] = data.time.d
				}

				// GPI
				for (let i = 1; i <= 8; i++) {
					const newState = data.gpi[`gpiValue${i}`]
					const name = data.gpi[`gpiName${i}`]

					if (this.state.gpi[i] !== newState) {
						this.state.gpi[i] = newState
						variableUpdates[`gpi_${i}`] = data.gpi[`gpiValue${i}`]
						checkFeedbacks = true
					}
					variableUpdates[`gpi_${i}_name`] = name
				}

				// GPO
				for (let i = 1; i <= 8; i++) {
					const newState = data.gpo[`gpoValue${i}`]
					const name = data.gpo[`gpoName${i}`]

					if (this.state.gpo[i] !== newState) {
						this.state.gpo[i] = newState
						variableUpdates[`gpo_${i}`] = newState ? 'On' : 'Off'
						checkFeedbacks = true
					}
					variableUpdates[`gpo_${i}_name`] = name
				}

				if (Object.keys(variableUpdates).length > 0) {
					this.setVariableValues(variableUpdates)
				}

				if (checkFeedbacks) {
					this.checkFeedbacks('gpiState', 'gpoState')
				}
			}
		} catch (_e) {
			// ignore error
		}
	}
}

runEntrypoint(IoCoreInstance, upgradeScripts)
