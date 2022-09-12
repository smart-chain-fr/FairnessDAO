import Event from "events";

export interface Toast {
	id: number;
	title: string;
	text: string;
	buttonText?: string;
	buttonLink?: string;
	time?: number;
}

class EventEmitter extends Event {}

export default class Toasts {
	private static ctx: Toasts;
	private toastList: Toast[] = [];
	private readonly event = new EventEmitter();

	private constructor() {
		Toasts.ctx = this;
	}

	public static getInstance() {
		if (!Toasts.ctx) new this();
		return Toasts.ctx;
	}

	public get toasts() {
		return this.toastList;
	}

	/**
	 * @returns removelistener callback
	 */
	public onChange(callback: (toastList: Toast[]) => void) {
		this.event.on("toast_update", callback);
		return () => {
			this.event.off("toast_update", callback);
		};
	}

	public add(toast: Toast) {
		this.toastList.unshift(toast);

		if (toast.time) {
			setTimeout(() => {
				const index = this.toastList.indexOf(toast);
				this.toastList.splice(index, 1);
				this.event.emit("toast_update", this.toastList);
			}, toast.time);
		}

		this.event.emit("toast_update", this.toastList);
	}

	public remove(toast: Toast) {
		const index = this.toastList.indexOf(toast);
		this.toastList.splice(index, 1);
		this.event.emit("toast_update", this.toastList);
	}
}
