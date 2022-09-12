import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}
export enum EOpeningState {
	CLOSED = "closed",
	OPENED = "opened",
}

export default class ProfileMenuStatus {
	private static ctx: ProfileMenuStatus;

	private _status: EOpeningState =
		(localStorage.getItem("profile-menu-status") as EOpeningState) ?? EOpeningState.CLOSED;
	private readonly event = new EventEmitter();

	private constructor() {
		ProfileMenuStatus.ctx = this;
		this.switch(this.status);
	}

	public static getInstance() {
		if (!ProfileMenuStatus.ctx) new this();
		return ProfileMenuStatus.ctx;
	}

	public get status() {
		return this._status;
	}

	/**
	 * @returns removelistener callback
	 */
	public onSwitch(callback: (type: EOpeningState) => void) {
		this.event.on("switch-profile-menu", callback);
		return () => {
			this.event.off("switch-profile-menu", callback);
		};
	}

	public toggle() {
		if (this.status === EOpeningState.CLOSED) {
			this.switch(EOpeningState.OPENED);
			return EOpeningState.OPENED;
		}
		this.switch(EOpeningState.CLOSED);
		return EOpeningState.CLOSED;
	}

	public close() {
		this.switch(EOpeningState.CLOSED);
	}

	private switch(type: EOpeningState) {
		if (type === this.status) return;
		this._status = type;
		localStorage.setItem("profile-menu-state", this._status);
		this.event.emit("switch-profile-menu", this._status);
	}
}
