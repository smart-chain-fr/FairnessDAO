import React from "react";
import Phase from 'Services/Contracts/Classes/Phase';
import classes from "./classes.module.scss";

type IProps = {
	phase: Phase;
};

type IState = {
	progress: number | null;
}

export default class ProgressBar extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props)
		this.state = {
			progress: null
		}
	}
	
	public render(): JSX.Element {
		const progress = this.state.progress ?? 0
		const width = progress.toString().concat("%");
		return (
			<div className={classes["root"]}>
				<div className={classes["progress"]} style={{ width }} />
			</div>
		);
	}

	public async componentDidMount(){
		const progress = await this.props.phase.getPhaseProgress();
		this.setState({progress})
	}
}
