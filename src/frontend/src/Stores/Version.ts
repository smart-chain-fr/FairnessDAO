import Config from "Configs/Config";
import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}
enum EVersionType {
	V0 = "v0",
	V1 = "v1",
}

export type IConfig = {
	version: string;
	date: string;
	pagesComingSoon: { [key: string]: { enabled: boolean; title: string; text: string } } | any;
};

export default class Version {
	private static ctx: Version;

	private config: IConfig[] = Config.getInstance().get().versions;

	private _version: IConfig | null = this.config[0] ?? null;
	private readonly event = new EventEmitter();

	private interval: number | null = null;

	private constructor() {
		Version.ctx = this;
		this.checkVersion();
	}

	public static getInstance() {
		if (!Version.ctx) new this();
		return Version.ctx;
	}

	public get version() {
		return this._version;
	}

	/**
	 * @returns removelistener callback
	 */
	public onSwitch(callback: (type: EVersionType) => void) {
		this.event.on("switch-version", callback);
		return () => {
			this.event.off("switch-version", callback);
		};
	}
	public toggleTo(version: IConfig) {
		this.switch(version);
		return this.version;
	}

	private switch(version: IConfig) {
		if (version === this.version) return;
		this._version = version;
		this.event.emit("switch-version", this._version);
	}

	private checkVersion() {
		window.clearTimeout(this.interval ?? 0);
		let timeOut = this.getNextVersionTime();
		if (this.version === this.config[this.config.length - 1] || !timeOut) return;
		const version = this.getNewCurrentVersion();

		if (version) {
			this.toggleTo(version);
		}

		if (timeOut < 0) timeOut = 0;

		this.interval = window.setTimeout(() => {
			this.checkVersion();
		}, timeOut);
	}

	private getNewCurrentVersion() {
		const today = new Date();
		return this.config.find((value) => {
			return today.getTime() >= new Date(value.date).getTime() && value.version > (this.version?.version ?? "");
		});
	}

	private getNextVersion() {
		return this.config.find((value) => {
			return value.version > (this.version?.version ?? "");
		});
	}

	private getNextVersionTime() {
		const nextVersion = this.getNextVersion();
		if (!nextVersion) return null;
		const now = new Date().getTime();
		const next = new Date(nextVersion.date).getTime();
		return next - now;
	}
}
