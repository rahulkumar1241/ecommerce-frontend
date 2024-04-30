import toast from "react-hot-toast";
import { API_MESSAGE_TYPE } from "../../constants/constants";
import SuccessLogo from "../../assets/images/icons/success.png";
import ErrorLogo from "../../assets/images/icons/error.png";
import DismissLogo from "../../assets/images/icons/cross(2).png";
import "./toast.scss";


const showToast = (type: any, message: any) => {
    switch (type) {
        case API_MESSAGE_TYPE.SUCCESS:
            toast(
                (t) => (
                    <span className="success-toaster">
                        <img
                            onClick={() => toast.dismiss(t.id)}
                            src={DismissLogo}
                            className="toaster-image-dismiss"
                            alt="" />
                        {message}
                    </span>
                ),
                {
                    icon: <img className="toaster-image" src={SuccessLogo} alt="" />,
                }
            );
            break;

        case API_MESSAGE_TYPE.ERROR:
            toast(
                (t) => (
                    <span>
                        <img
                            onClick={() => toast.dismiss(t.id)}
                            src={DismissLogo}
                            className="toaster-image-dismiss"
                            alt="" />
                        {message}

                    </span>
                ),
                {
                    icon: <img className="toaster-image" src={ErrorLogo} alt="" />,
                }
            );
            break;
    }
}


export default showToast;