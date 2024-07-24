import React from "react";
import Logo from "../../assets/images/icons/logo.jpg";
import "./footer.scss";

const Footer = () => {
    return <React.Fragment>
        <footer className="bs-footer">
            <div className="container">
                <div className="row">

                    <div className="col-lg-5 mb-1 mb-lg-0">
                        <h4>About Us</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</p>
                    </div>

                    <div className="col-lg-3 col-12 col-sm-12 offset-md-1 mb-1 mb-lg-0"></div>

                    <div className="col-lg-3 col-12 col-sm-12 mb-1 mb-lg-0">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>Jio Enterprises Limited,<br/>18th Floor World Mark Dubai, Aerocity, Gurgaon<br/>New Delhi-110037</li>
                            <li><a href="mailto:info@gmail.in">info@gmail.in</a></li>
                            <li><a href="tel:+918219406736">+91 82194-0636,+91 82194-0636</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </React.Fragment>
}

export default Footer;