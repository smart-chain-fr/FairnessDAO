import classes from "./classes.module.scss";
import BasePage from "../Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import I18n from "Components/Materials/I18n";

import SaleCard from "Components/Elements/SaleCard";
import Select from "Components/Elements/Select";
import Table from "Components/Elements/Table";
import NftIdentificator from "./Elements/NftIdentificator";
import ETHPrice from "./Elements/ETHPrice";
import CopyContent from "./Elements/CopyContent";
import ButtonElement from "./Elements/ButtonElement";
import AuctionMenus, { EMENUS } from "./Elements/AuctionMenus";
import Button from "Components/Elements/Button";
import SearchBar from "Components/Materials/Filters/SearchBar";

import Export from "Assets/images/icons/export.svg";

type IProps = {};
type IState = {
	menu: EMENUS;
	data: IData[];
};

type IHeader = {
	element: React.ReactNode;
	sortable?: boolean;
}[];

type ITableData = {
	header: IHeader;
	rows: React.ReactNode[][];
};

type ICardData = {
	header: IHeader;
	rows: {
		content: React.ReactNode[];
		button?: React.ReactNode;
	}[];
};

type IData = {
	name: string;
	lastestBid: string;
	myLastestBid?: string;
	timeLeft: string;
	user?: string;
	tokenID: string;
	contractAdress: string;
	status: "Re-bid" | "Finalize" | "Top bid" | "";
};

const dataParticipation: IData[] = [
	{
		name: "participation",
		lastestBid: "0.3473",
		myLastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "Finalize",
	},
	{
		name: "NFT Name",
		lastestBid: "0.3473",
		myLastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "Re-bid",
	},
	{
		name: "NFT Name",
		lastestBid: "0.3473",
		myLastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "Top bid",
	},
	{
		name: "NFT Name",
		lastestBid: "0.3473",
		myLastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "Re-bid",
	},
];

const dataAuctioned: IData[] = [
	{
		name: "auction",
		lastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "",
	},
	{
		name: "NFT Name",
		lastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "",
	},
	{
		name: "NFT Name",
		lastestBid: "0.3473",
		timeLeft: "02:23:55:04",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		status: "",
	},
];

const headerParticipation = [
	{ element: "Item", sortable: true },
	{ element: "Last Bid", sortable: true },
	{ element: "Your last bid", sortable: true },
	{ element: "Time Left", sortable: true },
	{ element: "Token ID", sortable: true },
	{ element: "Contract adress", sortable: true },
	{ element: " " },
];

const headerAuctioned = [
	{ element: "Item", sortable: true },
	{ element: "Last Bid", sortable: true },
	{ element: "Time Left", sortable: true },
	{ element: "From", sortable: true },
	{ element: "Token ID", sortable: true },
	{ element: "Contract adress", sortable: true },
];

export default class Auctions extends BasePage<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			menu: EMENUS.PARTICIPATION,
			data: dataParticipation,
		};
	}
	public render(): JSX.Element {
		const tableData = this.getTableData(this.state.data, this.state.menu);
		const cardData = this.getCardData(this.state.data, this.state.menu);
		return (
			<I18n
				map={[
					"pages_title.marketplace",
					"pages.auctions.auctions",
					"pages.auctions.participations",
					"pages.auctions.auctioned",
				]}
				content={([title, auctions, participations, auctioned]) => {
					return (
						<DefaultTemplate title={title!}>
							<div className={classes["header"]}>
								<div className={classes["page-title"]}>{auctions}</div>
								<div className={classes["export-desktop"]}>
									<Button variant="tertiary">
										{"Export to CSV"}
										<img className={classes["export-image"]} src={Export} alt="Export to excel" />
									</Button>
								</div>
								<div className={classes["export-responsiv"]}>
									<Button variant="tertiary" sizing="cube">
										<img className={classes["export-image"]} src={Export} alt="Export to excel" />
									</Button>
								</div>
							</div>
							<div className={classes["navigation-filters"]}>
								<AuctionMenus onChange={(menu: EMENUS) => this.onChange(menu)} />
								<div className={classes["filters"]}>
									<div className={classes["search-bar"]}>
										<SearchBar />
									</div>
									<div className={classes["sort-by"]}>
										<Select
											options={[
												{ value: "valeur", label: "label" },
												{ value: "valeur1", label: "label1" },
											]}
											placeholderKey="general_text.select"
										/>
									</div>
								</div>
							</div>
							<div className={classes["desktop-sales-view"]}>
								<Table header={tableData.header} rows={tableData.rows} />
							</div>

							<div className={classes["mobile-sales-view"]}>
								<div className={classes["card-container"]}>
									{cardData.rows.map((row, i) => (
										<SaleCard
											key={i}
											columnTitles={cardData.header}
											data={row.content}
											button={row.button}
										/>
									))}
								</div>
							</div>
						</DefaultTemplate>
					);
				}}
			/>
		);
	}

	private getTableData(data: IData[], menu: EMENUS): ITableData {
		if (menu === EMENUS.AUCTIONED) {
			const tableDataAuctioned: ITableData = {
				header: headerAuctioned,
				rows: data.map((row) => {
					return [
						<NftIdentificator name={row.name} />,
						<ETHPrice price={row.lastestBid + " ETH"} />,
						<div>{row.timeLeft}</div>,
						<div className={classes["userName"]}>{row.user}</div>,
						<CopyContent text={row.tokenID} />,
						<CopyContent text={row.contractAdress} isAdress={true} />,
					];
				}),
			};

			return tableDataAuctioned;
		}

		const tableDataParticipation: ITableData = {
			header: headerParticipation,
			rows: data.map((row) => {
				return [
					<NftIdentificator name={row.name} />,
					<ETHPrice price={row.lastestBid} />,
					row.myLastestBid ? <ETHPrice price={row.myLastestBid} /> : null,
					<div>{row.timeLeft}</div>,
					<CopyContent text={row.tokenID} />,
					<CopyContent text={row.contractAdress} isAdress={true} />,
					<ButtonElement text={row.status} size="m" />,
				];
			}),
		};

		return tableDataParticipation;
	}

	private getCardData(data: IData[], menu: EMENUS): ICardData {
		if (menu === EMENUS.AUCTIONED) {
			const cardDataAuctioned: ICardData = {
				header: headerAuctioned,
				rows: data.map((row) => {
					return {
						content: [
							<div className={classes["nftName"]}>{row.name}</div>,
							<ETHPrice price={row.lastestBid} />,
							<div>{row.timeLeft}</div>,
							<div className={classes["userName"]}>{row.user}</div>,
							<CopyContent text={row.tokenID} />,
							<CopyContent text={row.contractAdress} isAdress={true} />,
						] as React.ReactNode[],
					};
				}),
			};

			return cardDataAuctioned;
		}

		const cardDataParticipation: ICardData = {
			header: headerParticipation,
			rows: data.map((row) => {
				return {
					content: [
						<div className={classes["nftName"]}>{row.name}</div>,
						<ETHPrice price={row.lastestBid} />,
						row.myLastestBid ? <ETHPrice price={row.myLastestBid} /> : null,
						<div>{row.timeLeft}</div>,
						<CopyContent text={row.tokenID} />,
						<CopyContent text={row.contractAdress} isAdress={true} />,
					] as React.ReactNode[],
					button: <ButtonElement text="Re-bid" size="xl" />,
				};
			}),
		};

		return cardDataParticipation;
	}

	private onChange(menu: EMENUS) {
		this.setState({
			data: menu === EMENUS.PARTICIPATION ? dataParticipation : dataAuctioned,
			menu,
		});
	}
}

