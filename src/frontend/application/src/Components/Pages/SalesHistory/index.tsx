import classes from "./classes.module.scss";
import BasePage from "../Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

import SaleCard from "Components/Elements/SaleCard";
import Select from "Components/Elements/Select";
import Table from "Components/Elements/Table";
import NftIdentificator from "./Elements/NftIdentificator";
import ETHPrice from "./Elements/ETHPrice";
import User from "./Elements/User";
import CopyContent from "./Elements/CopyContent";
import I18n from "Components/Materials/I18n";
import SearchBar from "Components/Materials/Filters/SearchBar";
import Button from "Components/Elements/Button";

import Export from "assets/images/icons/export.svg";
type IProps = {};
type IState = {};

type IHeader = {
	element: React.ReactNode;
	sortable?: boolean;
}[];

type IData = {
	header: IHeader;
	rows: { [key: string]: any }[];
};

const tableData: IData = {
	header: [
		{ element: "Item", sortable: true },
		{ element: "Price", sortable: true },
		{ element: "To", sortable: true },
		{ element: "Collection name", sortable: true },
		{ element: "Contract adress", sortable: true },
		{ element: "Sale type" },
		{ element: "Time", sortable: true },
		{ element: "Tx Hash", sortable: true },
	],
	rows: [
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 1",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		},
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 2",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707c",
		},
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 3",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		},
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 4",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		},
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 5",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		},
		{
			name: "NFT Name",
			price: "0.3473",
			to: "John Doe",
			collectionName: "Test 6",
			contactAdress: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
			saleType: "Auction",
			time: "19/04/2022",
			txHash: "0xB7e390864a90b7b923C9f9310C6F98aafE43F707",
		},
	],
};
export default class SalesHistory extends BasePage<IProps, IState> {
	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.sales_history"]}
				content={([title]) => {
					return (
						<DefaultTemplate title={title!}>
							<div className={classes["header"]}>
								<div className={classes["page-title"]}>{title}</div>
								<div className={classes["export-desktop"]}>
									<Button variant="tertiary">
										{"Export to CSV"}
										<img className={classes["export-image"]} src={Export} alt="Export to CSV" />
									</Button>
								</div>
								<div className={classes["export-responsiv"]}>
									<Button variant="tertiary" sizing="cube">
										<img className={classes["export-image"]} src={Export} alt="Export to CSV" />
									</Button>
								</div>
							</div>
							<div className={classes["filters"]}>
								<div className={classes["search-bar"]}>
									<SearchBar></SearchBar>
								</div>
								<div className={classes["sort-by"]}>
									<Select
										options={[
											{ value: "valeur", label: "label" },
											{ value: "valeur1", label: "label1" },
										]}
										placeholderKey="Sort by"
									/>
								</div>
							</div>

							<div className={classes["desktop-sales-view"]}>
								<Table header={tableData.header} rows={this.getRowElement()} />
							</div>

							<div className={classes["mobile-sales-view"]}>
								{tableData.rows.map((row, i) => (
									<SaleCard key={i} columnTitles={tableData.header} data={this.getCardElement(row)} />
								))}
							</div>
						</DefaultTemplate>
					);
				}}
			/>
		);
	}
	private getRowElement(): React.ReactNode[][] {
		const rowsElems: React.ReactNode[][] = tableData.rows.map((row, index) => {
			return [
				<NftIdentificator name={row["name"]} />,
				<ETHPrice price={row["price"]} />,
				<User userName={row["to"]} />,
				row["collectionName"],
				<CopyContent text={row["contactAdress"]} isAdress={true} />,
				row["saleType"],
				row["time"],
				<CopyContent text={row["txHash"]} isAdress={true} />,
			];
		});
		return rowsElems;
	}

	private getCardElement(row: { [key: string]: any }): React.ReactNode[] {
		return [
			<div className={classes["card-label"]}>{row["name"]}</div>,
			<ETHPrice price={row["price"]} />,
			<User userName={row["to"]} />,
			row["collectionName"],
			<CopyContent text={row["contactAdress"]} isAdress={true} />,
			row["saleType"],
			row["time"],
			<CopyContent text={row["txHash"]} isAdress={true} />,
		];
	}
}

