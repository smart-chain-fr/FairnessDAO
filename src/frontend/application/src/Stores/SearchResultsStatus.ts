import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}

export enum EOpeningState {
	CLOSED = "closed",
	OPENED = "opened",
}

export default class SearchResultsStatus {
	private static ctx: SearchResultsStatus;

	private _status: EOpeningState =
		(localStorage.getItem("search-results-status") as EOpeningState) ?? EOpeningState.CLOSED;
	private readonly event = new EventEmitter();

	private constructor() {
		SearchResultsStatus.ctx = this;
		this.switch(this.status);
	}

	public static getInstance() {
		if (!SearchResultsStatus.ctx) new this();
		return SearchResultsStatus.ctx;
	}

	public get status() {
		return this._status;
	}

	/**
	 * @returns removelistener callback
	 */
	public onSwitch(callback: (type: EOpeningState) => void) {
		this.event.on("switch-search-results", callback);
		return () => {
			this.event.off("switch-search-results", callback);
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

	public open() {
		this.switch(EOpeningState.OPENED);
	}

	private canSwitch: boolean = true;

	public userCanSwitch(canSwitch: boolean): void {
		this.canSwitch = canSwitch;
	}

	private switch(type: EOpeningState) {
		if (this.canSwitch) {
			if (type === this.status) return;
			this._status = type;
			localStorage.setItem("search-results-state", this._status);
			this.event.emit("switch-search-results", this._status);
		}
	}
}
