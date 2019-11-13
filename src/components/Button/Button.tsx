import * as React from "react";

import "./Button.scss";

interface ButtonProps {
    text?: string,
    onClick?:(e:React.MouseEvent<HTMLElement>)=>void,
    disabled?:boolean,
}

export class Button extends React.Component<ButtonProps, {}> {
    render() {
        return (
            <button type={"submit"} disabled={this.props.disabled} onClick={this.props.onClick}
                    className={"button"}>{this.props.text}</button>
        );
    }
}