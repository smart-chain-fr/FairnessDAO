import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}

export enum EThemeModeType {
	LIGHT = "light",
	DARK = "dark",
}

export default class ThemeMode {
	private static ctx: ThemeMode;

	private _type: EThemeModeType = (localStorage.getItem("theme-mode") as EThemeModeType) ?? EThemeModeType.LIGHT;
	private readonly event = new EventEmitter();

	private constructor() {
		ThemeMode.ctx = this;
		this.switch(this.type);
	}

	public static getInstance() {
		if (!ThemeMode.ctx) new this();
		return ThemeMode.ctx;
	}

	public get type() {
		return this._type;
	}

	/**
	 * @returns removelistener callback
	 */
	public onSwitch(callback: (type: EThemeModeType) => void) {
		this.event.on("switch-theme-mode", callback);
		return () => {
			this.event.off("switch-theme-mode", callback);
		};
	}
	public toggle() {
		if (this.type === EThemeModeType.DARK) {
			this.switch(EThemeModeType.LIGHT);
			return this.type;
		}
		this.switch(EThemeModeType.DARK);
		return this.type;
	}

	private switch(type: EThemeModeType) {
		if (type === this.type) return;
		this._type = type;
		localStorage.setItem("theme-mode", this._type);
		this.event.emit("switch-theme-mode", this._type);
	}
}
