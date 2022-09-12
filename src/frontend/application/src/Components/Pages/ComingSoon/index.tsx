import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

import BasePage from "../Base";

type IProps = {
	title: string;
	text: string;
};

export default class ComingSoon extends BasePage<IProps> {
	public render(): JSX.Element {
		return (
			<DefaultTemplate title={this.props.title}>
			</DefaultTemplate>
		);
	}
}

