import { ReactComponent as Burger } from "Assets/images/icons/menu-burger.svg";
import { ReactComponent as Cross } from "Assets/images/icons/menu-cross.svg";
import classes from "./classes.module.scss";

type IProps = {
	type: "burger" | "cross";
};

export default function BurgerCross({ type }: IProps) {
	if (type === "burger") {
		return <Burger className={classes["menu-icon"]} />;
	} else {
		return <Cross className={classes["menu-icon"]} />;
	}
}
