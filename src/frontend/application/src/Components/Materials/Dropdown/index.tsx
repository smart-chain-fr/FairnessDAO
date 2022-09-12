import React from "react";
import classes from "./classes.module.scss";
import { ReactComponent as ArrowDown } from "assets/images/icons/arrow-down.svg";
import WindowStore from "Stores/WindowStore";

type IProps = {
	icon?: JSX.Element;
	label: string;
	variant?: "primary" | "secondary" | "tertiary";
	onOpen?: (isOpen: boolean) => void;
	closeAction?: (closabled: () => void) => void;
};

type IState = {
	open: boolean;
	dropdownHeight: number;
	animate: boolean;
};
export default class Dropdown extends React.Component<IProps, IState> {
	static defaultProps: IProps = {
		variant: "primary",
		label: ""
	};
	private contentRef = React.createRef<HTMLDivElement>();
	private removeOnresize = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			open: false,
			dropdownHeight: 0,
			animate: true,
		};
	}

	public render(): JSX.Element | null {
		return (
			<div {...this.props} className={classes["root"]} data-open={this.state.open} data-animate={this.state.animate}>
				<div className={classes["dropdown-header-container"]} onClick={() => this.toggle()}>
					<div className={classes["dropdown-left-part"]}>
						{this.props.icon}
						<p className={classes["dropdown-label"]}>{this.props.label}</p>
					</div>
					<ArrowDown className={classes["dropdown-arrow"]} />
				</div>
				<div
					className={classes["dropdown-content-container"]}
					style={{ height: this.state.dropdownHeight + "px" }}
					ref={this.contentRef}
				>
					<div className={classes["dropdown-content"]}>{this.props.children}</div>
				</div>
			</div>
		);
	}

	public componentDidMount() {
		this.removeOnresize = WindowStore.getInstance().onResize(() => this.onResize());
		if (!this.props.closeAction) return;
		this.props.closeAction(() => this.close());
	}

	public componentWillUnmount() {
		this.removeOnresize();
	}

	private close() {
		this.setState({
			dropdownHeight: 0,
			open: false,
			animate: true,
		});
	}

	private onResize() {
		if (!this.state.open) return;
		this.setState(
			{
				dropdownHeight: 0,
				animate: false,
			},
			() => {
				let dropdownHeight = 0;
				if (this.state.open) dropdownHeight = this.contentRef.current?.scrollHeight ?? 0;
				this.setState({
					dropdownHeight,
					animate: false,
				});
			},
		);
	}

	private toggle() {
		if (this.props.onOpen && !this.state.open) {
			this.props.onOpen(false);
		}

		let dropdownHeight = 0;
		if (!this.state.open) dropdownHeight = this.contentRef.current?.scrollHeight ?? 0;

		this.setState({
			dropdownHeight,
			open: !this.state.open,
			animate: true,
		});
	}
}
