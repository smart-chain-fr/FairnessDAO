import React from "react";
import classes from "./classes.module.scss";
import Toasts, { Toast as ToastProps } from "Stores/Toasts";
import Button from "../Button";
import { ReactComponent as Cross } from "assets/images/icons/cross.svg";
type IProps = {
	toast: ToastProps;
};

type IState = {
	isMounted: boolean;
};

export default class ToastElement extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			isMounted: false,
		};
	}
	public render(): JSX.Element {
		const toast = this.props.toast;
		const style = { "--data-duration": `${toast.time}ms` } as React.CSSProperties;
		return (
			<div className={classes["root"]} data-mounted={this.state.isMounted}>
				{toast.time && <div className={classes["loadbar"]} style={style} />}
				<div className={classes["toast-container"]}>
					<div className={classes["title-container"]}>
						{toast.title}
						<Cross className={classes["cross"]} onClick={() => Toasts.getInstance().remove(toast)} />
					</div>
					<div className={classes["text-container"]}>{toast.text}</div>
					{toast.buttonText && toast.buttonLink && (
						<div className={classes["button-container"]}>
							<Button
								sizing="s"
								variant="primary"
								onClick={() => {
									Toasts.getInstance().add({
										id: Math.random(),
										title: "Test",
										text: "Test",
										time: Math.random() * (20000 - 3000) + 3000,
									});
								}}>
								{toast.buttonText}
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	}

	public componentDidMount() {
		setTimeout(() => {
			this.setState({
				isMounted: true,
			});
		}, 1);
	}
}
