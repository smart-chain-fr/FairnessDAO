import React from "react";
import classes from "./classes.module.scss";
import Toasts, { Toast } from "Stores/Toasts";
import ToastElement from "Components/Elements/ToastElement";

type IProps = {};
type IState = {
	toastList: Toast[];
};
export default class ToastsContainer extends React.Component<IProps, IState> {
	private removeOnChange = () => {};
	public constructor(props: IProps) {
		super(props);
		this.state = {
			toastList: Toasts.getInstance().toasts,
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.state.toastList.map((toast) => {
					return <ToastElement toast={toast} key={toast.id} />;
				})}
			</div>
		);
	}

	private updateToasts() {
		this.setState({
			toastList: Toasts.getInstance().toasts,
		});
	}

	public componentDidMount() {
		this.removeOnChange = Toasts.getInstance().onChange(() => {
			this.updateToasts();
		});
	}

	public componentWillUnmount() {
		this.removeOnChange();
	}
}
