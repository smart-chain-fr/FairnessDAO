import Select from "Components/Elements/Select";
import Tag from "Components/Materials/Tag";
import React from "react";
import classes from "./classes.module.scss";

import Dropdown from "../../Dropdown";
import I18n from "Components/Materials/I18n";
import Module from "Components/Materials/Module";
import Tags from "Stores/Tags";
import Button from "Components/Elements/Button";


export type IFiltersProps = {
	Status: {
		enabled: boolean
	},
	SortBy: {
		enabled: boolean
	},
	Price: {
		enabled: boolean
	},
	Chains: {
		enabled: boolean
	},
	Attributes: {
		enabled: boolean
	}
}

type IProps = {
	content: IFiltersProps;
};

type IState = {
	token?: string | null,
	min?: string | null,
	max?: string | null,
};

export default class FiltersContent extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			token: null,
			min: null,
			max: null,
		}
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.status()}
				{this.sortBy()}
				{this.price()}
				{this.chains()}
				{this.attributes()}
			</div>
		);
	}

	private addTag(label: string) {
		Tags.getInstance().addTag(label)
	}

	private removeTagContain(label: string) {
		Tags.getInstance().removeTagContain(label)
	}

	private status(): JSX.Element {
		return (
			<Module from={this.props.content.Status}>
				<div className={classes["filter"]}>
					<div className={classes["subtitle"]}>
						<I18n map="components.filters.status_title" />
					</div>
					<div className={classes["status"]}>
						<I18n map={["components.filters.on_sale", "components.filters.on_offer"]} content={([on_sale, on_offer]) => {
							return <>
								<Tag variant="status" value={on_sale} />
								<Tag variant="status" value={on_offer} />
							</>
						}} />
					</div>
				</div>
			</Module>
		)
	}

	private sortBy(): JSX.Element {
		const options = [
			{ value: "recently_listed", labelKey: "components.filters.recently_listed" }
		];
		return (
			<Module from={this.props.content.SortBy}>
				<div className={classes["filter"]}>
					<div className={classes["subtitle"]}>
						<I18n map="components.filters.sort_by" />
					</div>
					<Select onChange={(e) => this.addTag(e?.label!)} options={options} placeholderKey="general_text.select" />
				</div>
			</Module>
		)
	}

	private price(): JSX.Element {
		const options = [
			{ value: 'USD', label: 'USD' },
			{ value: 'ETH', label: 'ETH' },
			{ value: 'SOL', label: 'SOL' }
		]
		const priceTagLabel = (): string | null => {
			const token = this.state.token ?? null
			const min = this.state.min ?? null
			const max = this.state.max ?? null
			if (!token || !min || !max) return null;
			if (Number(min) > Number(max)) return null;
			const label = "Price: " + token + " (" + min + "-" + max + ")";
			return (label);
		}

		const updatePriceTag = () => {
			const label = priceTagLabel()
			if (label) {
				this.removeTagContain("Price: " + this.state.token)
				this.addTag(label)
			}
		}

		return (
			<Module from={this.props.content.Price}>
				<div className={classes["filter"]}>
					<div className={classes["subtitle"]}>
						<I18n map="components.filters.price" />
					</div>
					<Select
						onChange={(e) => this.setState({ token: e?.label })}
						options={options}
						placeholderKey="general_text.select" />
					<div className={classes["min-max"]}>
						<I18n map={["general_text.min"]} content={([min]) => {
							return <input
								onChange={(e) => this.setState({ min: e.currentTarget.value })}
								type="number"
								min={0}
								placeholder={min} />
						}} />
						<div className={classes["to"]}><I18n map="components.filters.to" /></div>
						<I18n map={["general_text.max"]} content={([max]) => {
							return <input
								onChange={(e) => this.setState({ max: e.currentTarget.value })}
								type="number"
								min={0}
								placeholder={max} />
						}} />
					</div>
					<Button variant="ghost" onClick={() => updatePriceTag()}><I18n map="general_text.apply" /></Button>
				</div>
			</Module >
		)
	}

	private chains(): JSX.Element {
		const options = [
			{ value: "ethereum", labelKey: "asset_names.ethereum" },
			{ value: "polygon", labelKey: "asset_names.polygon" },
			{ value: "solana", labelKey: "asset_names.solana" },
		];
		return (
			<Module from={this.props.content.Chains}>
				<div className={classes["filter"]}>
					<div className={classes["subtitle"]}>
						<I18n map="components.filters.chains" />
					</div>
					<Select onChange={(e) => this.addTag("Chain: " + e?.label!)} options={options} placeholderKey="general_text.select" />
				</div>
			</Module>
		)
	}

	private attributes(): JSX.Element {
		return (
			<Module from={this.props.content.Attributes}>
				<div className={classes["filter"]}>
					<div className={classes["subtitle"]}>
						<I18n map="components.filters.attributes" />
					</div>
					<div className={classes["dropdown-container"]}>
						<Dropdown variant="secondary" label="Attribute">
							<div className={classes["attribute"]}>
								<div>attribute 1</div>
								<div>attribute 2</div>
								<div>attribute 3</div>
							</div>
						</Dropdown>
						<Dropdown variant="secondary" label="Attribute">
							<div className={classes["attribute"]}>
								<div>attribute 1</div>
								<div>attribute 2</div>
								<div>attribute 3</div>
							</div>
						</Dropdown>
						<Dropdown variant="secondary" label="Attribute">
							<div className={classes["attribute"]}>
								<div>attribute 1</div>
								<div>attribute 2</div>
								<div>attribute 3</div>
							</div>
						</Dropdown>
						<Dropdown variant="secondary" label="Attribute">
							<div className={classes["attribute"]}>
								<div>attribute 1</div>
								<div>attribute 2</div>
								<div>attribute 3</div>
							</div>
						</Dropdown>
						<Dropdown variant="secondary" label="Attribute">
							<div className={classes["attribute"]}>
								<div>attribute 1</div>
								<div>attribute 2</div>
								<div>attribute 3</div>
							</div>
						</Dropdown>
					</div>
				</div>
			</Module>
		)
	}
}

