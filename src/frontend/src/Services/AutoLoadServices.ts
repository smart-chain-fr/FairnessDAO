import StoreWorflow from "./StoreWorkflow";

/**
 * Service that will automatically instanciate other services on load
 */
export default class AutoLoadServices {
	private static instance: AutoLoadServices;

	private constructor() {
		AutoLoadServices.instance = this;
		this.init();
	}

	public static load(): void {
		this.instance ?? new this();
	}

	private init() {
		StoreWorflow.getInstance();
	}
}
