import React, { useImperativeHandle, forwardRef, useState } from "react";
import "./drawer.scss";
import Offcanvas from 'react-bootstrap/Offcanvas';


const DrawerComponent: React.FC<any> = forwardRef((props: any, ref: any) => {

    const [show, setShow] = useState(false);

    useImperativeHandle(ref, () =>
    ({
        handleClickOpen: () => {
            setShow(true)
        },
        handleClose: () => {
            setShow(false)
        }
    }));

    const handleClose = () => {
        setShow(false);
    }

    return (
        <div className="drawer-container">
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{props.description ? props.description : ""}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                   
                        {props.children}
                   
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
});

export default DrawerComponent;
