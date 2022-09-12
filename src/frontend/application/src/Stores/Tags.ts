import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}

export type TagsType = (string | null)[];

export default class Tags {
	private static ctx: Tags;

	private _tags: TagsType = [];
	private readonly event = new EventEmitter();

	private constructor() {
		Tags.ctx = this;
	}

	public static getInstance() {
		if (!Tags.ctx) new this();
		return Tags.ctx;
	}

	public get tags() {
		return this._tags;
	}

	public onChange(callback: (tags: TagsType) => void) {
		this.event.on("tag-list-change", callback);
		return () => {
			this.event.off("tag-list-change", callback);
		};
	}

	public addTag(label: string) {
		if (!this.tags.find((element) => element === label)) {
			this._tags.push(label);
			this.event.emit("tag-list-change", this.tags);
		}
	}

	public removeTag(label: string) {
		this._tags = this._tags.filter((element) => element !== label);
		this.event.emit("tag-list-change", this.tags);
	}

	public removeTagContain(label: string) {
		this._tags = this._tags.filter((element) => !element?.includes(label));
		this.event.emit("tag-list-change", this.tags);
	}

	public resetAll() {
		this._tags = [];
		this.event.emit("tag-list-change", this.tags);
	}
}

