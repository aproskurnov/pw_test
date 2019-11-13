import * as React from "react";
import Header from "../../Header/Header";
import TransactionCreating from "../../TransactionCreating/TransactionCreating";

export class Home extends React.Component<{}, {}> {
    constructor(props:{}) {
        super(props);
    }
    render() {
        return (
            <div className="container container_big">
                <Header/>
                <TransactionCreating/>
            </div>
        );
    }
}