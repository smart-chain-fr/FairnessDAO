import developmentConfig from "./development.json";
import productionConfig from "./production.json";
import stagingConfig from "./staging.json";

export default class Config {
	private static ctx: Config;
	private config: typeof developmentConfig = developmentConfig;
	constructor() {
		if (Config.ctx) return Config.ctx;
		Config.ctx = this;
		this.setConfig();
		return Config.ctx;
	}

	public static getInstance() {
		if (!Config.ctx) new this();
		return Config.ctx;
	}

	public get() {
		return this.config;
	}

	private setConfig() {
		switch (process.env["REACT_APP_ENV_NAME"]) {
			case "staging":
				this.config = stagingConfig;
				break;
			case "production":
				this.config = productionConfig;
				break;
		}
	}
}
