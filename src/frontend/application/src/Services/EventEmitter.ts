import Events from "events";

export default class EventEmitter extends Events {
	static defaultMaxListeners: number = 0;
}
