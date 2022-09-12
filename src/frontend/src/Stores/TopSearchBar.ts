import Event from "events";

export enum EOpeningState {
	CLOSED = "closed",
	OPENED = "opened",
}

class EventEmitter extends Event {}

export default class TopSearchBarStatus {
	private static ctx: TopSearchBarStatus;

	private _status: EOpeningState =
		(localStorage.getItem("top-searchbar-status") as EOpeningState) ?? EOpeningState.CLOSED;
	private readonly event = new EventEmitter();

	private constructor() {
		TopSearchBarStatus.ctx = this;
		this.switch(this.status);
	}

	public static getInstance() {
		if (!TopSearchBarStatus.ctx) new this();
		return TopSearchBarStatus.ctx;
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

	public close() {
		this.switch(EOpeningState.CLOSED);
	}

	public open() {
		this.switch(EOpeningState.OPENED);
	}

	private switch(type: EOpeningState) {
		if (type === this.status) return;
		this._status = type;
		localStorage.setItem("top-searchbar-status", this._status);
		this.event.emit("switch", this._status);
	}
}
