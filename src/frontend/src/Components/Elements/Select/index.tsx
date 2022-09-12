import I18n from "Components/Materials/I18n";
import React from "react";
import ReactSelect, { ActionMeta, SingleValue } from 'react-select'

type IOption = {
	value: string,
	label?: string,
	labelKey?: string,
}

type IProps = {
	options: IOption[],
	placeholderKey: string,
	variant?:string,
	onChange?: ((newValue: SingleValue<IOption>, actionMeta: ActionMeta<IOption>) => void)
};
type IState = {};

export default class Select extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		const styles = {
			option: (provided: any) => ({
				...provided,
				fontFamily: 'var(--font-primary)',
				fontStyle: 'normal',
				fontWeight: '400',
				fontSize: '14px',
				lineHeight: '20px',
				color: 'var(--color-neutral-8)',
			}),
			container: (provided: any) => ({
				...provided,
				background: 'var(--color-generic-white)',
				border: '1px solid #CBD5E1',
				borderRadius: '5px',
				width:'100%',
				height: '40px'
			}),
			control: () => ({
				width: '100%',
				display: 'flex',
			}),
			valueContainer: (provided: any) => ({
				...provided,
				fontFamily: 'var(--font-primary)',
				fontStyle: 'normal',
				fontWeight: '400',
				fontSize: '14px',
				lineHeight: '20px',
				color: 'var(--color-neutral-8)',
			}),
			input: (provided: any) => ({
				...provided,
				padding: 0,
				marginBottom: '7px',
				marginTop: '7px',
			}),
			indicatorSeparator: () => ({
				display: 'none',
			}),
		}

		if (this.props.placeholderKey) {
			const textToTranslate = [this.props.placeholderKey,...this.props.options.map((value) => value.labelKey ?? "")];
			return (
				<I18n map={textToTranslate} content={(trads: string[]) => {
					const options = trads.slice(1).map((trad, index) => ({value: this.props.options[index]!.value, label: this.props.options[index]?.label ?? trad}));
					return <ReactSelect placeholder={trads[0]} options={options} styles={styles} onChange={this.props.onChange} />
				}}/>
			);
		}
		return (
			<ReactSelect options={this.props.options} styles={styles} onChange={this.props.onChange} />
		);
		
	}

}
