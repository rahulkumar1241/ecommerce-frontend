import React, { Suspense, useRef, useState, useEffect } from "react";
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
import { API_MESSAGE_TYPE,getOS } from "../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { changePageNumber, getAllProducts, resetProductSlice } from "../../store/slices/product";
import { IoSearchOutline } from "react-icons/io5";

const Topbar = () => {
    const dispatch = useAppDispatch();
    const btnRef: any = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();
    let userData = useLocalStorage.getItem("userData") ? useLocalStorage.getItem("userData") : {};
    const LogoutRef: any = useRef();

    const { totalCartItem } = useAppSelector(state => state.cart)
    const { search_keyword, loadingGetAllProducts } = useAppSelector(state => state.product);
    let [search, setSearch]: any = useState("");

    const handleNavigate = (key: any) => {
        switch (key) {
            case "LOGOUT":
                LogoutRef.current.handleClickOpen();
                break;
            case "ACCOUNT":
                btnRef.current.click();
                navigate(PATH.PRIVATE.ACCOUNT);
                break;
        }
    }

    useEffect(() => {
        setSearch(search_keyword);
    }, [search_keyword])

    const onConfirm = () => {
        useLocalStorage.clear();
        showToast(API_MESSAGE_TYPE.SUCCESS, "Logout successfully.")
        navigate(PATH.PUBLIC.SIGN_IN);
    }

    const onDiscard = () => {
        LogoutRef.current.handleClose();
    }

    const handleSearch = async (e:any) => {
        e.preventDefault();
        const OFFSET = 18;

        let formData: any = {
            page_number: 1,
            page_size: OFFSET,
            filter_section: {
                name: search
            }
        }
        localStorage.setItem("search_keyword", search);

        let response = await dispatch(getAllProducts(formData));
        let searchData = response?.payload?.data ? response.payload.data : {};
        if (searchData.success) {
            navigate(PATH.PUBLIC.PRODUCTS.MAIN_ROUTE)
        }
        else {
            showToast(
                API_MESSAGE_TYPE.ERROR,
                searchData.message ?
                    searchData.message :
                    "Something went wrong"
            )
        }
    }
    
    const closeButtonFunc = () => {
        if (getOS() !== "desktop") {
            btnRef.current.click();
        }
    }



    return <React.Fragment>
        {loadingGetAllProducts ? <Loading loading={true} /> : null}

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top d-flex">

            <div className="container-fluid">
                <div className="navbar-brand" onClick={(e: any) => {

                    let userData = useLocalStorage.getItem("userData");

                    if (userData.role === 0 || userData === "") {
                        navigate(PATH.PUBLIC.HOME_PAGE)
                    }
                    else if (userData.role === 1) {
                        /////////////////////GO TO ADMIN DASHBOARD////////////////
                        navigate(PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD)
                    }
                }}></div>


                {!(userData.role === 1 || userData.role === 2) ? <form onSubmit={handleSearch}><div className="form-inline searchForm">

                    <div className="input_nav" >
                        <Input
                            value={search}
                            onChange={(e: any) => {
                                setSearch(e.target.value)
                            }}
                            type="text"
                            placeholder="Type here to search..."
                            autoFocus={true}
                        />
                    </div>
                    <div className="input_nav" >
                        <Button type="submit"
                            isFilled={true}
                            isFullWidth={false}
                            // onClick={handleSearch}
                            style={{
                                margin: "0px",
                                height: "35px"
                            }}
                        >
                            <IoSearchOutline />
                        </Button>
                    </div>


                </div> </form> : null}


                {useLocalStorage.getItem("userData") ?
                    <>
                        <button ref={btnRef} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-md-auto gap-2">

                                {useLocalStorage.getItem("userData")?.role === 0 ? <><li className="nav-item rounded" onClick={closeButtonFunc}>

                                    <Link to={PATH.PRIVATE.CART} style={{ paddingRight: "20px" }} className={`nav-link ${location.pathname === PATH.PRIVATE.CART ? 'active' : ''}`}
                                    >
                                        <span style={{ position: "relative" }}>
                                            <MdAddShoppingCart />Cart
                                            <span className="cart-item-count">{totalCartItem}</span>
                                        </span>
                                    </Link>


                                    {/* </span> */}
                                </li>
                                    <li className="nav-item rounded" onClick={closeButtonFunc}>
                                        <Link to={PATH.PRIVATE.GET_MY_ORDERS} className={`nav-link ${location.pathname === PATH.PRIVATE.GET_MY_ORDERS ? 'active' : ''}`}>My Orders</Link>
                                    </li>
                                    <li className="nav-item rounded" onClick={closeButtonFunc}>
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

                                    <li className="nav-item rounded">
                                        <Link to={PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.ADD_MEMBER} className={`nav-link ${location.pathname === PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.ADD_MEMBER ? 'active' : ''}`}>Add Members</Link>
                                    </li>
                                    <li className="nav-item rounded">
                                        <Link to={PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.MANAGE_OR_ADD_CATEGORY} className={`nav-link ${location.pathname === PATH.PRIVATE.ADMIN.MAIN_ROUTE + "/" + PATH.PRIVATE.ADMIN.CHILD_ROUTES.MANAGE_OR_ADD_CATEGORY ? 'active' : ''}`}>Category</Link>
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
                    </> :
                    <>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-md-auto gap-2">
                                <li className="nav-item rounded">
                                    <Link to={PATH.PUBLIC.SIGN_IN} className={`nav-link ${location.pathname === PATH.PRIVATE.GET_MY_ORDERS ? 'active' : ''}`}>Signin</Link>
                                </li>
                                <li className="nav-item rounded">
                                    <Link to={PATH.PUBLIC.SIGN_UP} className={`nav-link ${location.pathname === PATH.PRIVATE.WISHLIST ? 'active' : ''}`} >Signup</Link>
                                </li>
                            </ul>
                        </div>
                    </>

                }
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
