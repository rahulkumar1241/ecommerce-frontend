import { Navigate, useLocation } from "react-router-dom"
import useLocalStorage from '../utils/localStorage';
import { PATH } from '../paths/path';

const AdminRoute = ({ children }: any) => {
    const token = useLocalStorage.getItem("accessToken");
    const userInfo = useLocalStorage.getItem("userData");
    let location = useLocation();

    if (!(token) || (userInfo?.role !== 1)) {
        return <Navigate to={PATH.PUBLIC.SIGN_IN} state={{ from: location }} replace />
    }
    return children;
};

export default AdminRoute;