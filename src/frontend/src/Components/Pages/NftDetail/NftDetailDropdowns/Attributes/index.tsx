import classes from "./classes.module.scss";
import React from "react";
import I18n from "Components/Materials/I18n";
type IProps = {
	attributes: { attribute: string; state: string; percentage: number }[];
};

export default class Attributes extends React.Component<IProps> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.props.attributes.map((attribute, key) => {
					return (
						<div className={classes["attribute-block"]} key={key}>
							<p className={classes["attribute-title"]}>{attribute.attribute}</p>
							<p className={classes["attribute-state"]}>{attribute.state}</p>
							<p className={classes["attribute-percentage"]}>{attribute.percentage}% <I18n map={["components.attributes.have_this_trait"]}/></p>
						</div>
					);
				})}
			</div>
		);
	}
}
