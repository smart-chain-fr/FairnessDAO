import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}

export default class WindowStore {
	private static ctx: WindowStore;
	private readonly event = new EventEmitter();

	private constructor() {
		WindowStore.ctx = this;
		this.iniEvents();
	}

	public static getInstance() {
		if (!WindowStore.ctx) new this();
		return WindowStore.ctx;
	}

	public onScrollYDirectionChange(callback: (scrollYDifference: number) => void) {
		this.event.on("scrollYDirectionChange", callback);
		return () => {
			this.event.off("scrollYDirectionChange", callback);
		};
	}

	public onResize(callback: (window: Window) => void) {
		this.event.on("resize", callback);
		return () => {
			this.event.off("resize", callback);
		};
	}

	public onClick(callback: (e: MouseEvent) => void) {
		this.event.on("click", callback);
		return () => {
			this.event.off("click", callback);
		};
	}

	private iniEvents(): void {
		window.addEventListener("scroll", (e: Event) => this.scrollYHandler());
		window.addEventListener("resize", (e: Event) => this.resizeHandler());
		document.addEventListener("click", (e: MouseEvent) => this.clickHandler(e), true);
	}

	private clickHandler(e: MouseEvent) {
		this.event.emit("click", e);
	}

	private scrollYHandler = (() => {
		let previousY: number = window.scrollY;
		let snapShotY: number = previousY;
		let previousYDirection: number = 1;
		return (): void => {
			const scrollYDirection = window.scrollY - previousY > 0 ? 1 : -1;
			if (previousYDirection !== scrollYDirection) {
				snapShotY = window.scrollY;
			}

			this.event.emit("scrollYDirectionChange", snapShotY - window.scrollY);
			previousY = window.scrollY;
			previousYDirection = scrollYDirection;
		};
	})();

	private resizeHandler() {
		this.event.emit("resize", window);
	}
}
