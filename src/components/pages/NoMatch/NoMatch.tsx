import * as React from "react";

import "./NoMatch.scss";
import Header from "../../Header/Header";

export class NoMatch extends React.Component {
    render() {
        return (
            <div className="container container_big">
                <Header/>
                <div className="no-match">
                    <h1>404</h1>
                </div>
            </div>
                );
    }
}