import BasePage from "Components/Pages/Base";
import classes from "./classes.module.scss";

import { ReactComponent as SortIcon } from "assets/images/icons/arrow-down.svg";

type IProps = {
	text: React.ReactNode;
	sortableState: "ascending" | "descending" | "none"; // 1: ascending, -1: Descending, 0: Not displayed
	resetAction?: (closabled: () => void) => void;
	onChange?: (isOpen: boolean) => void; // 1: ascending, -1: Descending, 0: Not displayed

};
type IState = {
	sortableState: "ascending" | "descending" | "none"; // 1: ascending, -1: Descending, 0: Not displayed
};

export default class SortableColumn extends BasePage<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			sortableState: "none",
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]} data-state={this.state.sortableState} onClick={() => this.switchState()}>
				{this.props.text}
				<SortIcon className="sort-icon" />
			</div>
		);
	}
	private switchState() {
		if (this.props.onChange && this.state.sortableState === "none"){
			this.props.onChange(false);
		}
		switch (this.state.sortableState) {
			case "ascending":
				this.setState({ sortableState: "descending" });
				break;
			case "descending":
				this.setState({ sortableState: "none" });
				break;
			case "none":
				this.setState({ sortableState: "ascending"});
				break;
			default:
				break;
		}
	}

	public componentDidMount(){
		if (!this.props.resetAction) return;
        this.props.resetAction(() => this.close());
	}

	private close(){
		this.setState({ sortableState: "none" });
	}
}
