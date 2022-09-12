import EventService from "Services/EventEmitter";

import fr from "Configs/I18n/fr.json";
import en from "Configs/I18n/en.json";

class EventEmitter extends EventService {}

export type IKeyOfLng = keyof typeof fr;

export type ILngType = {
	[key in string]: string | ILngType;
};

const lngs: { [key: string]: ILngType } = {
	fr,
	en,
};

export default class I18nStore {
	private static instance: I18nStore;
	private readonly event = new EventEmitter();
	private _assetDefault: ILngType = lngs["fr"]!;
	private _asset: ILngType = lngs["fr"]!;
	private cache = new Map<string, any>();

	private constructor() {
		I18nStore.instance = this;
	}

	public static getInstance() {
		return I18nStore.instance ?? new this();
	}

	public get assetDefault() {
		return this._assetDefault;
	}

	public get asset() {
		return this._asset;
	}

	public getCache(key: string): string | undefined {
		return this.cache.get(key);
	}

	public setCache(key: string, value: string) {
		this.cache.set(key, value);
	}

	/**
	 * @returns removelistener callback
	 */
	public onChange(callback: (asset: ILngType) => void) {
		this.event.on("change", callback);
		return () => {
			this.event.off("change", callback);
		};
	}

	public toggleTo(key: string) {
		this.switch(lngs[key]!);
		return this.asset;
	}

	private switch(asset: ILngType) {
		if (asset === this._asset) return;
		this._asset = asset;

		// whenever the application's language changes the localization cache is fully cleared:
		this.cache.clear();

		this.event.emit("change", this._asset);
	}
}
