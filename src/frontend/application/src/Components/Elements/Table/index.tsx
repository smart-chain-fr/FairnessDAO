import BasePage from "Components/Pages/Base";
import classes from "./classes.module.scss";

import RowHeader from "./RowHeader";
import Row from "Components/Elements/Table/Row";

type IHeader = {
	element: React.ReactNode;
	sortable?: boolean;
}[];

type IProps = {
	header: IHeader;
	rows: React.ReactNode[][];
};

type IState = {};

export default class Table extends BasePage<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<RowHeader columnTitles={this.props.header} />
				{this.props.rows.map((row, i) => (
					<Row key={i} elements={row} />
				))}
			</div>
		);
	}

	// private cleanRowFromNullElements(row : React.ReactNode[] ): React.ReactNode[] {
	// 	var filtered = row.filter(function (el) {
	// 		return el != null;
	// 	  });
	// 	  return filtered;
	// }
}

