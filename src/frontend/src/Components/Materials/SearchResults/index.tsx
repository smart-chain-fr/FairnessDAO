import React from "react";

import classes from "./classes.module.scss";
import ResultBlock from "./ResultBlock";
import { ReactComponent as ArrowRight } from "Assets/images/icons/arrow-right.svg";
import SearchResultsStatus, { EOpeningState } from "Stores/SearchResultsStatus";
import I18n from "../I18n";

type IProps = {};

type IState = {
	status: EOpeningState;
};

export default class SearchResults extends React.Component<IProps, IState> {
	private elements = {
		collection: [
			{
				img: "img",
				txt: "Collection lorem ipsum dolor sit amet consectitur, Collection lorem ipsum dolor sit amet consectitur, Collection lorem ipsum dolor sit amet consectitur",
			},
			{
				img: "img",
				txt: "Collection",
			},
			{
				img: "img",
				txt: "Collection",
			},
		],
		nfts: [
			{
				img: "img",
				txt: "NFT",
			},
			{
				img: "img",
				txt: "NFT",
			},
			{
				img: "img",
				txt: "NFT",
			},
		],
		profiles: [
			{
				img: "img",
				txt: "Profile",
			},
			{
				img: "img",
				txt: "Profile",
			},
			{
				img: "img",
				txt: "Profile",
			},
		],
	};
	private removeOnSwitch = () => {};

	public constructor(props: IProps) {
		super(props);
		this.state = {
			status: SearchResultsStatus.getInstance().status,
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]} data-open={this.state.status}>
				<I18n
					map={["components.search_bar.collections", "components.search_bar.nfts", "components.search_bar.profiles"]}
					content={([collectionTrad, nftsTrad, profilesTrad]) => (
						<>
							<ResultBlock title={collectionTrad!} elements={this.elements.collection} />
							<ResultBlock title={nftsTrad!} elements={this.elements.nfts} />
							<ResultBlock title={profilesTrad!} elements={this.elements.profiles} />
						</>
					)}
				/>
				<div className={classes["all-results-line"]}>
					<I18n map="general_text.all_results" /> <ArrowRight />
				</div>
			</div>
		);
	}

	private updateStatus() {
		this.setState({
			status: SearchResultsStatus.getInstance().status,
		});
	}

	public componentDidMount() {
		this.removeOnSwitch = SearchResultsStatus.getInstance().onSwitch((type) => {
			this.updateStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}
}

