import I18n from "Components/Materials/I18n";
import React from "react";
import AuctionMenu from "./AuctionMenu";

import classes from "./classes.module.scss";

export enum EMENUS {
	PARTICIPATION = 'PARTICIPATION',
	AUCTIONED = 'AUCTIONED',
}

type IProps = {
	onChange: (menu: EMENUS) => void;
};

type IState = {
	menu: EMENUS;
};

export default class AuctionMenus extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			menu: EMENUS.PARTICIPATION,
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<I18n map={["pages.auctions.participations", "pages.auctions.auctioned"]} content={([participations, auctioned]) => {
					return <>
						<AuctionMenu
							onClick={() => this.switch(EMENUS.PARTICIPATION)}
							isActive={this.state.menu === EMENUS.PARTICIPATION}
							text={participations!}
						/>
						<AuctionMenu
							onClick={() => this.switch(EMENUS.AUCTIONED)}
							isActive={this.state.menu === EMENUS.AUCTIONED}
							text={auctioned!}
						/>
					</>
				}} />
			</div>
		);
	}

	private switch(menu: EMENUS) {
		this.setState({ menu });
		this.props.onChange(menu);
	}
}

