import React from "react";
import I18nStore from "Stores/I18nStore";

type IVars = { [key: string]: string };

type IProps = {
	map: string | string[];
	vars?: IVars;
	content?: (trads: string[]) => React.ReactNode;
};

type IState = {
	asset: { [key: string]: string | any };
};

/**
 * @example: usage <I18n map={"menu_status.bla"} vars={{myStringValue: this.state.myStringValue}}/>
 */
export default class I18n extends React.Component<IProps, IState> {
	private removeOnChange = () => {};
	private readonly assetDefault = I18nStore.getInstance().assetDefault;

	public constructor(props: IProps) {
		super(props);
		this.state = {
			asset: I18nStore.getInstance().asset,
		};
	}

	public render(): React.ReactNode | null {
		const translated: string[] = [];

		if (typeof this.props.map === "string") {
			translated.push(this.translate(this.props.map, this.props.vars));
		} else {
			translated.push(
				...this.props.map.map((key) => {
					return this.translate(key, this.props.vars);
				}),
			);
		}

		if (this.props.content) {
			return this.props.content(translated);
		}

		return translated.join(" ");
	}

	public componentDidMount() {
		this.removeOnChange = I18nStore.getInstance().onChange((asset) => {
			this.setState({ asset });
		});
	}

	public componentWillUnmount() {
		this.removeOnChange();
	}

	private translate(key: string, vars: IVars = {}) {
		const cacheKey = key.concat(JSON.stringify(vars));

		const value = I18nStore.getInstance().getCache(cacheKey);

		if (value !== undefined) return value;

		const assetValue: string | null = this.getFromObjectByKeyString(key, this.state.asset) ?? this.getFromObjectByKeyString(key, this.assetDefault);

		if (!assetValue) return key;

		const resultWithVariables = Object.keys(vars).reduce((str, key) => str.replaceAll(`{{${key}}}`, vars[key] ?? ""), assetValue);

		I18nStore.getInstance().setCache(cacheKey, resultWithVariables);
		return resultWithVariables;
	}

	private getFromObjectByKeyString(key: string, asset: { [key: string]: any }) {
		const keys = key.split(".");

		return keys.reduce((asset, key) => asset?.[key] ?? null, asset) as any;
	}
}
