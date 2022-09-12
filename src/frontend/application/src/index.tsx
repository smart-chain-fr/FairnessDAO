import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Main from "./Components/Main";
import AutoLoadServices from "Services/AutoLoadServices";
import ToastsContainer from "Components/Materials/ToastsContainer";

AutoLoadServices.load();

ReactDOM.render(
	<React.StrictMode>
		<ToastsContainer />
		<Main />
	</React.StrictMode>,
	document.getElementById("root"),
);
