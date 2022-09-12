import classes from "./classes.module.scss";
import BasePage from "../Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

import SaleCard from "Components/Elements/SaleCard";
import Select from "Components/Elements/Select";
import Table from "Components/Elements/Table";
import NftIdentificator from "./Elements/NftIdentificator";
import ETHPrice from "./Elements/ETHPrice";
import CopyContent from "./Elements/CopyContent";
import ButtonElement from "./Elements/ButtonElement";
import AuctionMenus, { EMENUS } from "./Elements/AuctionMenus";
import Button from "Components/Elements/Button";

import Export from "assets/images/icons/export.svg";
import SearchBar from "Components/Materials/Filters/SearchBar";

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
	price: string;
	user: string;
	tokenID: string;
	contractAdress: string;
	date: string;
	status: "Accept" | "Cancel";
};
const dataReceived: IData[] = [
	{
		name: "Offers received",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Accept",
	},
	{
		name: "Offers received",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Accept",
	},
	{
		name: "Offers received",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Accept",
	},
];
const dataMade: IData[] = [
	{
		name: "Offers made",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Cancel",
	},
	{
		name: "Offers received",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Cancel",
	},
	{
		name: "Offers received",
		price: "0.3473",
		user: "John Doe",
		tokenID: "780000117",
		contractAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		date: "19/04/2022",
		status: "Cancel",
	},
];

const headerReceived = [
	{ element: "Item", sortable: true },
	{ element: "Price", sortable: true },
	{ element: "From", sortable: true },
	{ element: "Token ID", sortable: true },
	{ element: "Contract adress", sortable: true },
	{ element: "Date", sortable: true },
	{ element: " " },
];

const headerMade = [
	{ element: "Item", sortable: true },
	{ element: "Price", sortable: true },
	{ element: "From", sortable: true },
	{ element: "Token ID", sortable: true },
	{ element: "Contract adress", sortable: true },
	{ element: "Date", sortable: true },
	{ element: " " },
];

export default class Offers extends BasePage<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			menu: EMENUS.RECEIVED,
			data: dataReceived,
		};
	}
	public render(): JSX.Element {
		const tableData = this.getTableData(this.state.data, this.state.menu);
		const cardData = this.getCardData(this.state.data, this.state.menu);
		return (
			<DefaultTemplate title="Offers">
				<div className={classes["header"]}>
					<div className={classes["page-title"]}>Offers</div>
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
								placeholderKey="Sort by"
								options={[
									{ value: "valeur", label: "label" },
									{ value: "valeur1", label: "label1" },
								]}
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
							<SaleCard key={i} columnTitles={cardData.header} data={row.content} button={row.button} />
						))}
					</div>
				</div>
			</DefaultTemplate>
		);
	}

	private getTableData(data: IData[], menu: EMENUS): ITableData {
		if (menu === EMENUS.RECEIVED) {
			const tableDataAuctioned: ITableData = {
				header: headerReceived,
				rows: data.map((row) => {
					return [
						<NftIdentificator name={row.name} />,
						<ETHPrice price={row.price} />,
						<div className={classes["userName"]}>{row.user}</div>,
						<CopyContent text={row.tokenID} />,
						<CopyContent text={row.contractAdress} isAdress={true} />,
						<div>{row.date}</div>,
						<ButtonElement text={row.status} size="m" />,
					];
				}),
			};
			return tableDataAuctioned;
		}
		const tableDataParticipation: ITableData = {
			header: headerMade,
			rows: data.map((row) => {
				return [
					<NftIdentificator name={row.name} />,
					<ETHPrice price={row.price} />,
					<div className={classes["userName"]}>{row.user}</div>,
					<CopyContent text={row.tokenID} />,
					<CopyContent text={row.contractAdress} isAdress={true} />,
					<div>{row.date}</div>,
					<ButtonElement text={row.status} size="m" />,
				];
			}),
		};

		return tableDataParticipation;
	}

	private getCardData(data: IData[], menu: EMENUS): ICardData {
		if (menu === EMENUS.RECEIVED) {
			const cardDataAuctioned: ICardData = {
				header: headerReceived,
				rows: data.map((row) => {
					return {
						content: [
							<div className={classes["nftName"]}>{row.name}</div>,
							<ETHPrice price={row.price} />,
							<div className={classes["userName"]}>{row.user}</div>,
							<CopyContent text={row.tokenID} />,
							<CopyContent text={row.contractAdress} isAdress={true} />,
							<div>{row.date}</div>,
						] as React.ReactNode[],
						button: <ButtonElement text="Accept" size="xl" />,
					};
				}),
			};

			return cardDataAuctioned;
		}

		const cardDataParticipation: ICardData = {
			header: headerMade,
			rows: data.map((row) => {
				return {
					content: [
						<div className={classes["nftName"]}>{row.name}</div>,
						<ETHPrice price={row.price} />,
						<div className={classes["userName"]}>{row.user}</div>,
						<CopyContent text={row.tokenID} />,
						<CopyContent text={row.contractAdress} isAdress={true} />,
						<div>{row.date}</div>,
					] as React.ReactNode[],
					button: <ButtonElement text="Cancel" size="xl" />,
				};
			}),
		};

		return cardDataParticipation;
	}

	private onChange(menu: EMENUS) {
		this.setState({
			menu,
			data: menu === EMENUS.RECEIVED ? dataReceived : dataMade,
		});
	}
}

