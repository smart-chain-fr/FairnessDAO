import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

export default class Home extends BasePage {
	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.home"]}
				content={([title]) => <DefaultTemplate title={title!}>home</DefaultTemplate>}
			/>
		);
	}
}

