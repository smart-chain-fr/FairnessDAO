import React from "react";
import ModuleConfig from "Configs/Module";

type IProps = {
	from: {
		enabled: boolean;
		props?: {
			[key: string]: any;
		};
	};
};

type IState = {};

export default class Module extends React.Component<IProps, IState> {
	public render(): React.ReactNode | null {
		if (!this.props.from.enabled) return null;
		return <>{this.props.children}</>;
	}

	public static get config() {
		return ModuleConfig.getInstance().get().modules;
	}
}

