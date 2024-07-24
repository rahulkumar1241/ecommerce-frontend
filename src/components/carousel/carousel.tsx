import Carousel from 'react-bootstrap/Carousel';
import Image1 from "../../assets/images/banner/image_2.jpg";
import Image2 from "../../assets/images/banner/image_3.jpg";
import Image3 from "../../assets/images/banner/image_4.jpg";
import Image4 from "../../assets/images/banner/image_5.jpg";
import "./carousel.scss";

const Slider = () => {
    return (
        <div className='carousel'>
            <Carousel data-bs-theme="dark">
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={Image1}
                        alt="First slide"
                        rel="preload"

                    />
                    <Carousel.Caption>
                        <h5>First slide label</h5>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={Image2}
                        alt="Second slide"
                        rel="preload"
                    />
                    <Carousel.Caption>
                        <h5>Second slide label</h5>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={Image3}
                        alt="Third slide"
                        rel="preload"
                    />
                    <Carousel.Caption>
                        <h5>Third slide label</h5>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src={Image4}
                        alt="Third slide"
                        rel="preload"
                    />
                    <Carousel.Caption>
                        <h5>Fourth slide label</h5>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Slider;