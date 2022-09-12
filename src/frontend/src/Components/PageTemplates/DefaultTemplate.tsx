import React from "react";

import Footer from "Components/Materials/Footer";
import Header from "Components/Materials/Header";
import WrongChain from "Components/Materials/WrongChain";

import classes from "./classes.module.scss";
import TopMenu from "Components/Materials/TopMenu";

type IProps = {
	title: string;
	children?: React.ReactChild | React.ReactChild[];
};
type IState = {};

export default class DefaultTemplate extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<>
				<Header />
				<TopMenu />
				<WrongChain />
				<div className={classes["root"]}>
					<div className={classes["content"]}>{this.props.children}</div>
				</div>
				<Footer />
			</>
		);
	}

	componentDidMount() {
		window.document.title = this.props.title;
	}
}
