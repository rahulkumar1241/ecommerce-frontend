export const PATH: any =
{
    PUBLIC: {
        SIGN_IN: "/sign-in",
        SIGN_UP: "/sign-up",
        FORGOT_PASSWORD: "/forgot-password",
        CONFIRM_PASSWORD: "/confirm-password"
    },
    PRIVATE: {
        HOME_PAGE: "/home-page",
        ACCOUNT: "/account",
        PRODUCTS: {
            MAIN_ROUTE: "/products",
            CHILD_ROUTES: {
                VIEW_ALL_PRODUCTS: "",
                VIEW_PRODUCT: "view-product",
                VIEW_PRODUCTS_BY_CATEGORY: "category"
            }
        },
        ADMIN: {
            MAIN_ROUTE: "/admin",
            CHILD_ROUTES: {
                VIEW_ALL_PRODUCTS: "view-all-products",
                CREATE_VIEW_OR_EDIT_PRODUCT: "product",
                UPLOAD_PRODUCT_SHEET: "upload-sheet-product",
                VIEW_ALL_ORDER_ITEMS: "view-all-order-items",
                VIEW_EDIT_ORDER_ITEM_INFO: "order-item",
                DASHBOARD: "dashboard"
            }
        },

        CART: "/my-cart",
        WISHLIST: "/my-wishlist",
        ORDER_MAIN: "/addtional-order-details",
        GET_MY_ORDERS: "/my-orders",
        VIEW_ORDER_ITEM_DETAILS: "/view-order-item-info"
    }
}