import BasePage from "Components/Pages/Base";
import classes from "./classes.module.scss";

import nftCard from "Assets/images/nft-card-mock.png";

type IHeader = {
	element: React.ReactNode;
	sortable?: boolean;
}[];

type IProps = {
	data: React.ReactNode[];
	columnTitles: IHeader;
	button?: React.ReactNode;
};
type IState = {};
export default class SaleCard extends BasePage<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<img className={classes["nft-image"]} alt="NFT" src={nftCard}></img>
				<div className={classes["low-card"]}>
					<div className={classes["nft-data"]}>
						<div className={[classes["nft-data-content"], classes["nft-data-label"]].join(" ")}>
							{this.props.columnTitles.map((column, i) => (
								<div key={i}>{column.element}</div>
							))}
						</div>
						<div className={classes["nft-data-content"]}>
							{this.props.data.map((element, i) => (
								<div key={i}>{element}</div>
							))}
						</div>
					</div>
					{this.props.button ? this.props.button : ""}
				</div>
			</div>
		);
	}
}

