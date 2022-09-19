import BasePage from "Components/Pages/Base";
import classes from "./classes.module.scss";

// import nftCard from "Assets/images/nft-card-mock.png";

// import EthPrice from "Components/Elements/EthPrice";
// import TextAndIcon from "./SubRowElement/TextAndIcon";

// type INftData = {
// 	name: string;
// 	price?: string;
// 	timeLeft?: string;
// 	from?: string;
// 	to?: string;
// 	collectionName?: string;
// 	tokenID?: string;
// 	contactAdress: string;
// 	saleType?: string;
// 	time?: string;
// 	txHash?: string;
// 	mobile?: boolean;
// };
type IProps = {
	elements: React.ReactNode[];
};
type IState = {};
export default class Row extends BasePage<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.props.elements.map((element, i) => (element ? <div key={i}>{element}</div> : null))}
			</div>
		);
	}
}

