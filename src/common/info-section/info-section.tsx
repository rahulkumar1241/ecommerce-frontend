

import React from "react";
import { FaMessage } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";
import "./info-section.scss";

import { MdOutlineEmail } from "react-icons/md";
const InfoSection = () => {


    return <React.Fragment>
        <div className="top-info">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-10 col-sm-9">
                        <div className="top-info-left">
                            <a
                                style={{ cursor: "pointer" }}
                                className="need-support"
                            >
                                Need Support
                            </a>
                            <ul className="top-info-list list-inline">
                                <li>
                                    <a
                                        target="_blank"
                                        href="mailto:abc@gmail.com"
                                    >
                                        {" "}
                                       <MdOutlineEmail style={{
                                            color:"#e9611e",
                                            marginRight:"3px"
                                        }}/>
                                        <label>Email: </label>
                                        <span>info@gmail.com</span>
                                    </a>
                                </li>
                                <li>
                                    <a target="_blank" href="tel:+91-82194-06736">
                                        <FaPhone style={{
                                            color:"#e9611e",
                                            marginRight:"3px"
                                        }}/>
                                        <label>Helpline: </label>
                                        <span>+91-82194-06736</span>
                                    </a>
                                    <small className="desk-supp">
                                        (Mon-Sun, 9AM-7PM)
                                    </small>
                                </li>
                                <li>
                                    <a
                                        target="_blank"
                                        href="https://api.whatsapp.com/send?phone=+9182194-06736&text=Hi"
                                        className="d-flex justify-content-center align-items-center"
                                    >
                                        <FaMessage style={{
                                            color:"#e9611e",
                                            marginRight:"3px"
                                        }}/>
                                        <small className="mob-supp">
                                            (Mon-Sun, 9AM-7PM)
                                        </small>{" "}
                                        <label>WhatsApp: </label>{" "}
                                        <span>+91- 82194-06736</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-sm-3">

                    </div>
                </div>
            </div>
        </div>

    </React.Fragment>

}

export default InfoSection;
