import React, { Suspense, lazy, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PATH } from "../paths/path";
import ErrorBoundary from "../components/errorboundary/errorboundary";
import Loading from "../components/loader/loader";
import ProtectedRoute from "./protectedRoute";
import Footer from "../common/footer/footer";
import Topbar from "../common/topbar/topbar";
import DeliveryRoute from "./DeliveryRoute";
import AdminRoute from "./AdminRoute";
import InfoSection from "../common/info-section/info-section";
import CsutomFloatingWatsapp from "../common/watsapp/FloatingWatsApp";
import useLocalStorage from "../utils/localStorage";
///////////////////COMPONENTS///////////////
const SignIn = lazy(() => import('../containers/authentication/login/login'));
const SignUp = lazy(() => import('../containers/authentication/signup/signup'));
const Forgotpassword = lazy(() => import('../containers/authentication/forgotpassword/forgotpassword'));
const ConfirmPassword = lazy(() => import("../containers/authentication/confirmpassword/confirmpassword"));
const Homepage = lazy(() => import("../containers/products/homepage/homepage"));
const ViewAllProductsByCategory = lazy(() => import("../containers/products/products/viewallproductsbycategory/viewallproductsbycategory"));
const MyCart = lazy(() => import("../containers/products/products/cart/cart"));
const MyWishlist = lazy(() => import("../containers/products/products/wishlist/wishlist"));
const ViewOrderItemInfo = lazy(() => import("../containers/delivery/vieworderitemstatus/vieworderitemstatus"));
const AccountInfo = lazy(() => import("../containers/authentication/account/account"));

const AdminViewAllProducts = lazy(() => import("../containers/admin/viewallproducts/viewallproducts"));
const AdminProductAction = lazy(() => import("../containers/admin/productaction/product"));
const AdminUploadProductSheet = lazy(() => import("../containers/admin/uploadsheet/uploadsheet"));
const AdminOrders = lazy(() => import("../containers/admin/orders/order"));
const AdminOrderItemInfo = lazy(() => import("../containers/admin/orderitem/orderitem"));
const AdminDashboard = lazy(() => import("../containers/admin/dashboard/dashboard"));
const AdminAddMemberScreen = lazy(() => import("../containers/admin/addmember/addmember"));

const OrderMain = lazy(() => import("../containers/order/ordermain"));

const MyOrders = lazy(() => import("../containers/order/myorders/myorders"));

const NotFound = lazy(() => import('../common/notfound'));
///////////////////products////////////
const ViewAllProducts = lazy(() => import('../containers/products/products/viewallproducts/viewallproducts'));
const ViewProduct = lazy(() => import('../containers/products/products/viewproduct/viewproduct'));

const exclusionArray =
    [
        '/',
        PATH.PUBLIC.SIGN_IN,
        PATH.PUBLIC.SIGN_UP,
        PATH.PUBLIC.FORGOT_PASSWORD,
        PATH.PUBLIC.CONFIRM_PASSWORD,
    ];

const ProjectRoutes: React.FC = (): JSX.Element => {
    //////////////////////////////////
    const location = useLocation();
    const isHeaderFooterVisible = exclusionArray.indexOf(location.pathname) < 0;
    ////////////SET UP LAZY LOADING LATER ON////////////

    const userData = useLocalStorage.getItem("userData");
    const token = useLocalStorage.getItem("accessToken");


    return (
        <ErrorBoundary>
            <Suspense fallback={<Loading loading={true} />}>
                <React.Fragment>
                   
                    <InfoSection />
                    {isHeaderFooterVisible ? <Topbar /> : ""}
                 


                    <Routes>
                        <Route
                            path={PATH.PUBLIC.SIGN_IN}
                            element={
                                <SignIn
                                />} />
                        <Route
                            path={PATH.PUBLIC.SIGN_UP}
                            element={<SignUp />} />
                        <Route
                            path={PATH.PUBLIC.FORGOT_PASSWORD}
                            element={
                                <Forgotpassword />}
                        />
                        <Route
                            path={PATH.PUBLIC.CONFIRM_PASSWORD}
                            element={<ConfirmPassword />}
                        />

                        <Route path={PATH.PRIVATE.VIEW_ORDER_ITEM_DETAILS} element={
                            <DeliveryRoute>
                                <ViewOrderItemInfo />
                            </DeliveryRoute>
                        }
                        />

                        <Route path={PATH.PRIVATE.ACCOUNT} element={
                            <ProtectedRoute>
                                <AccountInfo />
                            </ProtectedRoute>
                        }
                        />



                        <Route path={PATH.PRIVATE.CART} element={
                            <ProtectedRoute>
                                <MyCart />
                            </ProtectedRoute>
                        }
                        />

                        <Route path={PATH.PRIVATE.GET_MY_ORDERS} element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                        />

                        <Route path={PATH.PRIVATE.ORDER_MAIN} element={
                            <ProtectedRoute>
                                <OrderMain />
                            </ProtectedRoute>
                        }
                        />

                        <Route path={PATH.PRIVATE.WISHLIST} element={
                            <ProtectedRoute>
                                <MyWishlist />
                            </ProtectedRoute>
                        }
                        />



                        <Route path={PATH.PUBLIC.HOME_PAGE} element={<Homepage />} />


                        <Route path={`${PATH.PRIVATE.ADMIN.MAIN_ROUTE}/*`}>

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_PRODUCTS} element={
                                <AdminRoute>
                                    <AdminViewAllProducts />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.ADD_MEMBER} element={
                                <AdminRoute>
                                    <AdminAddMemberScreen />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.CREATE_VIEW_OR_EDIT_PRODUCT} element={
                                <AdminRoute>
                                    <AdminProductAction />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.UPLOAD_PRODUCT_SHEET} element={
                                <AdminRoute>
                                    <AdminUploadProductSheet />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_ALL_ORDER_ITEMS} element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.VIEW_EDIT_ORDER_ITEM_INFO} element={
                                <AdminRoute>
                                    <AdminOrderItemInfo />
                                </AdminRoute>} />

                            <Route path={PATH.PRIVATE.ADMIN.CHILD_ROUTES.DASHBOARD} element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>} />
                        </Route>

                        <Route path={`${PATH.PUBLIC.PRODUCTS.MAIN_ROUTE}/*`}>

                            <Route path={PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCT} element={<ViewProduct />} />

                            <Route path={PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_ALL_PRODUCTS} element={<ViewAllProducts />} />

                            <Route path={PATH.PUBLIC.PRODUCTS.CHILD_ROUTES.VIEW_PRODUCTS_BY_CATEGORY} element={<ViewAllProductsByCategory />} />

                        </Route>


                        <Route
                            path="/"
                            element={<Navigate to={PATH.PUBLIC.HOME_PAGE} replace={true} />}
                        />
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>

                    {(token && userData?.role === 0) ?<CsutomFloatingWatsapp/>:null}

                    {isHeaderFooterVisible ? <Footer /> : ""}
                </React.Fragment >
            </Suspense >
        </ErrorBoundary>
    )
}


export default ProjectRoutes;