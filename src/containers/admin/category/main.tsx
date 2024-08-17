import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import AddCategory from "./addcategory";
import ManageCategory from "./managecategory";
import "./common.scss";

const CategoryMain = () => {
    return <React.Fragment>
        <div className="category-container">
            <div className="row mt-3">
                <div className="col-12 tabs-product-view">
                    <Tabs
                        defaultActiveKey="add-category"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        mountOnEnter={true} 
                        unmountOnExit={true} 
                    >
                        <Tab eventKey="add-category" title="Add Category">
                            <AddCategory />
                        </Tab>

                        <Tab eventKey="add-offer-banner" title="Add/Update Banner">
                            <ManageCategory />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </React.Fragment>

}

export default CategoryMain;
