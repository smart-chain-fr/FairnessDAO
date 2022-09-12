import React, { useEffect } from "react";
import { Navigate, Outlet, Route, HashRouter as Router, Routes, useLocation } from "react-router-dom";

import Version, { IConfig } from "Stores/Version";

import ThemeMode from "../Stores/ThemeMode";
import ComingSoon from "./Pages/ComingSoon";
import Home from "./Pages/Home";
import Marketplace from "./Pages/Marketplace";
import Ressources from "./Pages/Ressources";
import Module from "./Materials/Module";
import NftDetail from "./Pages/NftDetail";
import Profile from "./Pages/Profile";
import Auctions from "./Pages/Auctions";
import StoreWorkflow from "Services/StoreWorkflow";
import SalesHistory from "./Pages/SalesHistory";
import Offers from "./Pages/Offers";
import I18n from "./Materials/I18n";
import Toasts from "Stores/Toasts";

type IProps = {};

type IState = {
	version: IConfig | null;
};

export default class Main extends React.Component<IProps, IState> {
	private removeThemeModeOnSwitch = () => {};
	private removeVersionOnSwitch = () => {};

	public constructor(props: IProps) {
		super(props);
		this.state = {
			version: Version.getInstance().version,
		};
		this.updateThemeMode();
		this.updateVersion();
	}

	public render(): JSX.Element {
		return (
			<Router basename="/">
				<Routes>
					<Route element={<BindRouter version={this.state.version} />}>
						{this.routes()}
						<Route element={<Navigate to="/" replace />} path="*" />
					</Route>
				</Routes>
			</Router>
		);
	}

	public componentDidMount() {
		this.removeThemeModeOnSwitch = ThemeMode.getInstance().onSwitch(() => this.updateThemeMode());
		this.removeVersionOnSwitch = Version.getInstance().onSwitch(() => this.updateVersion());

		Toasts.getInstance().add({
			id: Math.random(),
			title: "Pass the KYC",
			text: "To have access to all the functionality of the website you have to pass the KYC",
			buttonLink: "string",
			buttonText: "Pass KYC",
		});
	}

	public componentWillUnmount() {
		this.removeThemeModeOnSwitch();
		this.removeVersionOnSwitch();
	}

	private updateThemeMode() {
		document.body.setAttribute("theme-mode", ThemeMode.getInstance().type);
	}

	private updateVersion() {
		this.setState({
			version: Version.getInstance().version,
		});
		document.body.setAttribute("version", Version.getInstance().version?.version ?? "");
	}

	private routes(): React.ReactElement | null {
		const pageConfig = Module.config.pages;
		return (
			<>
				<Route
					element={
						<Module from={pageConfig.Home}>
							<Home />
						</Module>
					}
					path={pageConfig.Home.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.Marketplace}>
							<Marketplace />
						</Module>
					}
					path={pageConfig.Marketplace.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.Ressources}>
							<Ressources />
						</Module>
					}
					path={pageConfig.Ressources.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.NftDetail}>
							<NftDetail />
						</Module>
					}
					path={pageConfig.NftDetail.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.Profile}>
							<Profile />
						</Module>
					}
					path={pageConfig.Profile.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.Auctions}>
							<Auctions />
						</Module>
					}
					path={pageConfig.Auctions.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.SalesHistory}>
							<SalesHistory />
						</Module>
					}
					path={pageConfig.SalesHistory.props.path}
				/>
				<Route
					element={
						<Module from={pageConfig.Offers}>
							<Offers />
						</Module>
					}
					path={pageConfig.Offers.props.path}
				/>
			</>
		);
	}
}

function BindRouter({ version }: { version: IConfig | null }) {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
		StoreWorkflow.getInstance().closeOnTopLayouts();
		document.body.setAttribute("route", location.pathname);
	}, [location.pathname]);

	if (version && version.pagesComingSoon) {
		const pageComingSoon = version?.pagesComingSoon[location.pathname];
		if (pageComingSoon?.enabled) {
			return <I18n map={[pageComingSoon.titleLocalizationKey, pageComingSoon.textLocalizationKey]} content={([title, translatedText]) => <ComingSoon title={title!} text={translatedText!} />} />;
		}
	}
	return <Outlet />;
}
