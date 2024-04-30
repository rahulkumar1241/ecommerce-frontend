import React, { Suspense, useRef } from "react";
import "./topnavbar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";
import { MdAccountBox } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { PATH } from "../../paths/path";
import useLocalStorage from "../../utils/localStorage";
import Loading from "../../components/loader/loader";
import ConfirmDialog from "../../components/confirmdialog/confirmdialog";
import showToast from "../../components/toasters/toast";
import { API_MESSAGE_TYPE } from "../../constants/constants";
import { useAppSelector } from "../../store/hooks";

const Topbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let userData = useLocalStorage.getItem("userData");
    const LogoutRef: any = useRef();

    const { totalCartItem } = useAppSelector(state => state.cart)

    const handleNavigate = (key: any) => {
        switch (key) {
            case "LOGOUT":
                LogoutRef.current.handleClickOpen();
                break;
            case "ACCOUNT": navigate(PATH.PRIVATE.ACCOUNT);
                break;
        }
    }

    const onConfirm = () => {
        useLocalStorage.clear();
        showToast(API_MESSAGE_TYPE.SUCCESS, "Logout successfully.")
        navigate(PATH.PUBLIC.SIGN_IN);
    }

    const onDiscard = () => {
        LogoutRef.current.handleClose();
    }

    return <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <div className="navbar-brand" onClick={(e: any) => {

                    let userData = useLocalStorage.getItem("userData");

                    if (userData.role === 0) {
                        navigate(PATH.PRIVATE.HOME_PAGE)
                    }
                    else if (userData.role === 1) {
                        /////////////////////GO TO ADMIN DASHBOARD////////////////
                        navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD)
                    }
                }}></div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-md-auto gap-2">

                        {useLocalStorage.getItem("userData")?.role === 0 ? <><li className="nav-item rounded">
                            <div style={{ position: "relative" }}>
                                <Link to={PATH.PRIVATE.CART} style={{ paddingRight: "20px" }} className={`nav-link ${location.pathname === PATH.PRIVATE.CART ? 'active' : ''}`}
                                ><MdAddShoppingCart />Cart</Link>
                                <span style={{
                                    position: "absolute",
                                    top: "-2px", right: "1px",
                                    color: "rgb(33,37,41)",
                                    background: "white",
                                    borderRadius: "8px",
                                    padding: "0px 4px",
                                    fontWeight: "600"
                                }}>{totalCartItem}</span>
                            </div>
                        </li>
                            <li className="nav-item rounded">
                                <Link to={PATH.PRIVATE.GET_MY_ORDERS} className={`nav-link ${location.pathname === PATH.PRIVATE.GET_MY_ORDERS ? 'active' : ''}`}>My Orders</Link>
                            </li>
                            <li className="nav-item rounded">
                                <Link to={PATH.PRIVATE.WISHLIST} className={`nav-link ${location.pathname === PATH.PRIVATE.WISHLIST ? 'active' : ''}`} >My Wishlist</Link>
                            </li>
                        </>
                            : ""}

                        {useLocalStorage.getItem("userData")?.role === 1 ? <>

                            <li className="nav-item rounded">
                                <Link to={PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD} className={`nav-link ${location.pathname === PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD ? 'active' : ''}`}>Dashboard</Link>
                            </li>

                            <li className="nav-item rounded">
                                <Link to={PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_PRODUCTS} className={`nav-link ${location.pathname === PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_PRODUCTS ? 'active' : ''}`}>Products</Link>
                            </li>

                            <li className="nav-item rounded">
                                <Link to={PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_ORDER_ITEMS} className={`nav-link ${location.pathname === PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_ORDER_ITEMS ? 'active' : ''}`}>Orders</Link>
                            </li>

                        </>
                            : ""}

                        <li className="nav-item dropdown rounded">
                            {/* string.charAt(0).toUpperCase() + string.slice(1); */}
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">{`Hi, ${userData.firstname.charAt(0).toUpperCase() + userData.firstname.slice(1)}`}</a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                {useLocalStorage.getItem("userData")?.role === 0
                                    ?
                                    <>
                                        <li>
                                            <span className="dropdown-item" onClick={(e: any) => handleNavigate("ACCOUNT")}>
                                                <MdAccountBox />Account
                                            </span>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                    </> : ""}
                                <li><span className="dropdown-item" onClick={(e: any) => handleNavigate("LOGOUT")}>
                                    <FiLogOut /> Logout</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <Suspense fallback={<Loading />}>
            <ConfirmDialog
                ref={LogoutRef}
                description={"Are you sure you want to Logout?"}
                confirm={"confirm"}
                discard={"Cancel"}
                onConfirm={onConfirm}
                onDiscard={onDiscard}
            ></ConfirmDialog>
        </Suspense>

    </React.Fragment >
}

export default Topbar;