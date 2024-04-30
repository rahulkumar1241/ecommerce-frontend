import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "./loader.scss";


const Loading = (props: any) => {
    const { loading } = props;
    return (
        <div className='loaderContainer'>
            <Backdrop
                sx={{ color: "#e9611e", zIndex: "9999" }}
                open={loading}
            >
                <CircularProgress style={{ height: "35px", width: "35px" }} className="custom-spinner" color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Loading;
