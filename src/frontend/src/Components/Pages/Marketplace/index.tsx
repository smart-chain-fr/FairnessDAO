import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

export default class Marketplace extends BasePage {
	public render(): JSX.Element {
		return (
			<I18n map={["pages_title.marketplace"]} content={([title]) =>
				<DefaultTemplate title={title!} >Hello</DefaultTemplate>
			}/>
		);
	}
}
