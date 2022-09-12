import BasePage from "Components/Pages/Base";
import classes from "./classes.module.scss";
 
import SortableColumn from "Components/Elements/Table/SortableColumn";

type IHeader = {
	element: React.ReactNode;
	sortable?: boolean;
}[];

type IProps = {
	columnTitles: IHeader;
};
type IState = {};
export default class RowHeader extends BasePage<IProps, IState> {
	private closabled: (() => void)[] = [];

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["array-labels"]}>
					{this.props.columnTitles.map((columnTitle, i) =>
						columnTitle.sortable ? (
							<div className={classes["filterable-title"]} key={i}>
								<SortableColumn
									text={columnTitle.element}
									sortableState={"ascending"}
									resetAction={(closabled) => this.closabled.push(closabled)}
									onChange={(isOpen) => this.onOpen(isOpen)}
								/>
							</div>
						) : (
							<div key={i}>{columnTitle.element}</div>
						),
					)}
				</div>
			</div>
		);
	}

	private onOpen(isOpen: boolean) {
        this.closeAllSorter();
    }

    private closeAllSorter() {
        this.closabled.forEach((close) => {
            close();
        })
    }

}

