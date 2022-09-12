import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import classes from "./classes.module.scss";

export default class Staking extends BasePage {
	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.resources"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<h1>Staking</h1>
							
							<div className={classes["card"]}>Staking</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

