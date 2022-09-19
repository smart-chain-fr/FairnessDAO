import classes from "./classes.module.scss";
import React from "react";
import AddressShort from "Components/Elements/AddressShort";
import { ReactComponent as ArrowRight } from "Assets/images/icons/arrow-right-details.svg";
import { ReactComponent as CopyIcon } from "Assets/images/icons/copy.svg";
import CopyClipboard from "Components/Elements/CopyClipboard";
import { Link } from "react-router-dom";
import I18n from "Components/Materials/I18n";
type IProps = {
	contractAddress: string;
	tokenId: string;
	tokenStandard: string;
	blockchain: string;
};

export default class Details extends React.Component<IProps> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["details-block"]}>
					<p className={classes["details-label"]}><I18n map={["general_text.contract_address"]}/></p>
					<CopyClipboard value={this.props.contractAddress}>
						<p className={classes["details-info"]}>
							<AddressShort text={this.props.contractAddress} />
							<CopyIcon />
						</p>
					</CopyClipboard>
				</div>
				<div className={classes["details-block"]}>
					<p className={classes["details-label"]}><I18n map={["general_text.token_id"]}/></p>
					<CopyClipboard value={this.props.tokenId}>
						<p className={classes["details-info"]}>
							<AddressShort text={this.props.tokenId} />
							<CopyIcon />
						</p>
					</CopyClipboard>
				</div>
				<div className={classes["details-block"]}>
					<p className={classes["details-label"]}><I18n map={["general_text.token_standart"]}/></p>
					<p className={classes["details-info"]}>{this.props.tokenStandard}</p>
				</div>
				<div className={classes["details-block"]}>
					<p className={classes["details-label"]}><I18n map={["general_text.blockchain"]}/></p>
					<p className={classes["details-info"]}>{this.props.blockchain}</p>
				</div>
				<div className={classes["details-block"]}>
					<p className={classes["details-label"]}><I18n map={["general_text.metadatas"]}/></p>
					<Link to="/" className={[classes["details-info"], classes["metadatas"]].join(" ")}>
						<I18n map={["general_text.metadatas"]}/> <ArrowRight />
					</Link>
				</div>
			</div>
		);
	}
}
