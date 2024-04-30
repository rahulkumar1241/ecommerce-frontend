import React from "react";
import "./link.scss";
import { Link } from "react-router-dom";

const MyLink = (props: any) => {

    const { label, navigatePath ,style} = props;

    return <React.Fragment>
        <div className="linkWrapper">
            <Link to={navigatePath} style={{...style}}>{label || "No label"}</Link>
        </div>
    </React.Fragment>
}

export default MyLink;