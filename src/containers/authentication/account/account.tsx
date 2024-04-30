import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import "./common.scss";
import Info from "./info";
import EmailInfo from "./emailinfo";

const AccountInfo = () => {
    return <React.Fragment>
        <div className="account-container">
            <div className="row mt-3">
                <div className="col-12 tabs-product-view">
                    <Tabs
                        defaultActiveKey="account-info"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="account-info" title="Account Info">
                            <Info/>
                        </Tab>

                        <Tab eventKey="email-info" title="Email Info">
                            <EmailInfo/>
                        </Tab>

                    </Tabs>
                </div>
            </div>
        </div>
    </React.Fragment>

}

export default AccountInfo;