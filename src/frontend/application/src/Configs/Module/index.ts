import moduleJson from "./module.json";

export default class Module {
	private static ctx: Module ;
	private config: typeof moduleJson = moduleJson;
	constructor() {
		if (Module.ctx) return Module.ctx;
		Module.ctx = this;
		return Module.ctx;
	}

	public static getInstance() {
		if (!Module.ctx) new this();
		return Module.ctx;
	}

	public get() {
		return this.config;
	}
}
