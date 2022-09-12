import Event from "events";

export enum EOpeningState {
	CLOSED = "closed",
	OPENED = "opened",
}

class EventEmitter extends Event {}

export default class TopMenuStatus {
	private static ctx: TopMenuStatus;

	private _status: EOpeningState = (localStorage.getItem("top-menu-status") as EOpeningState) ?? EOpeningState.CLOSED;
	private readonly event = new EventEmitter();

	private constructor() {
		TopMenuStatus.ctx = this;
		this.switch(this.status);
	}

	public static getInstance() {
		if (!TopMenuStatus.ctx) new this();
		return TopMenuStatus.ctx;
	}

	public get status() {
		return this._status;
	}

	/**
	 * @returns removelistener callback
	 */
	public onSwitch(callback: (type: EOpeningState) => void) {
		this.event.on("switch", callback);
		return () => {
			this.event.off("switch", callback);
		};
	}

	public toggle() {
		if (this.status !== EOpeningState.OPENED) {
			this.switch(EOpeningState.OPENED);
			return EOpeningState.OPENED;
		}
		this.switch(EOpeningState.CLOSED);
		return EOpeningState.CLOSED;
	}

	public open() {
		this.switch(EOpeningState.OPENED);
	}

	public close() {
		this.switch(EOpeningState.CLOSED);
	}

	private switch(type: EOpeningState) {
		if (type === this.status) return;
		this._status = type;
		localStorage.setItem("top-menu-status", this._status);
		this.event.emit("switch", this._status);
	}
}
