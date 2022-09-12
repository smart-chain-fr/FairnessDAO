import ProfileMenuStatus from "Stores/ProfileMenuStatus";
import SearchResultsStatus from "Stores/SearchResultsStatus";
import TopMenuStatus, { EOpeningState } from "Stores/TopMenuStatus";
import TopSearchBarStatus from "Stores/TopSearchBar";

export default class StoreWorflow {
	private static instance: StoreWorflow;

	private constructor() {
		StoreWorflow.instance = this;
		this.initEvents();
	}

	public static getInstance() {
		return this.instance ?? new this();
	}

	public closeOnTopLayouts() {
		SearchResultsStatus.getInstance().close();
		ProfileMenuStatus.getInstance().close();
		TopMenuStatus.getInstance().close();
		TopSearchBarStatus.getInstance().close();
	}

	private initEvents() {
		this.onTopMenuOpened();
		this.onTopSearchBarOpened();
	}

	private onTopMenuOpened() {
		TopMenuStatus.getInstance().onSwitch((type) => {
			if (type === EOpeningState.OPENED) {
				TopSearchBarStatus.getInstance().close();
			}
		});
	}

	private onTopSearchBarOpened() {
		TopSearchBarStatus.getInstance().onSwitch((type) => {
			if (type === EOpeningState.OPENED) {
				TopMenuStatus.getInstance().close();
			}
		});
	}
}
