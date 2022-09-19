import React from "react";

import classes from "./classes.module.scss";
import { ReactComponent as ArrowRight } from "Assets/images/icons/arrow-right.svg";
import MockSearchResultImg from "./mock-search-result.png";

type IProps = {
	title: string;
	elements: { img: string; txt: string }[];
};

type IState = {};

export default class ResultBlock extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["title"]}>
					{this.props.title} <ArrowRight />
				</div>
				<div className={classes["separator"]} />
				<div className={classes["elements-container"]}>
					{this.props.elements.map((elem: any, key: number) => {
						return (
							<div className={classes["element"]} key={key}>
								<img src={MockSearchResultImg} alt="" />
								{elem.txt}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
