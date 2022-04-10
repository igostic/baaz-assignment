import "./App.css";
import Carousel from "./components/Carousel/Carousel";
import Card from "./components/Products/Card";
import Footer from "./components/Footer/Footer";
import carouselImage1 from "./assets/images/carousel/image102.png";
import carouselImage2 from "./assets/images/carousel/image103.png";
import carouselImage3 from "./assets/images/carousel/image104.png";

function App() {
  return (
    <div>
      <h5 style={{ textAlign: "center" }}>Baaz Assignment</h5>
      <Carousel>
        <img src={carouselImage1} alt="" />
        <img src={carouselImage2} alt="" />
        <img src={carouselImage3} alt="" />
      </Carousel>
      <h1 className="Heading">Popular </h1>
      <Card />
      <Footer />
    </div>
  );
}

export default App;
