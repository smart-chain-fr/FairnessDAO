import React from "react";
import classes from "./classes.module.scss";
import { ReactComponent as Clock } from "Assets/images/icons/clock.svg";

type IState = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};
type IProps = {
	deadline: Date;
	label: string;
};
export default class Timer extends React.Component<IProps, IState> {
	private interval: NodeJS.Timer | null = null;

	public constructor(props: IProps) {
		super(props);
		this.state = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["first-line"]}>
					<Clock />
					<p className={classes["label"]}>{this.props.label}</p>
				</div>
				<div className={classes["clock-container"]}>
					{this.getClockElement(this.state.days, "Days")}
					{this.getClockElement(this.state.hours, "Hours")}
					{this.getClockElement(this.state.minutes, "Minutes")}
					{this.getClockElement(this.state.seconds, "Seconds")}
				</div>
			</div>
		);
	}

	public componentDidMount() {
		this.interval = setInterval(() => {
			this.setTimers();
		}, 1000);
	}

	public componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	private getClockElement(number: number, label: string) {
		return (
			<div className={classes["clock-element"]}>
				<p className={classes["clock-element-number"]}>{number}</p>
				<p className={classes["clock-element-label"]}>{label}</p>
			</div>
		);
	}
	private setTimers() {
		const countDown = this.props.deadline.getTime();
		const now = new Date().getTime();
		const distance = countDown - now;

		const toSecond = 1000,
			toMinute = toSecond * 60,
			toHour = toMinute * 60,
			toDays = toHour * 24;
		this.setState({
			days: Math.floor(distance / toDays),
			hours: Math.floor((distance % toDays) / toHour),
			minutes: Math.floor((distance % toHour) / toMinute),
			seconds: Math.floor((distance % toMinute) / toSecond),
		});
	}
}
