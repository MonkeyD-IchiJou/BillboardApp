import React from "react";
import Slider from "react-slick";
import Grid from 'react-css-grid';
import data from './data.json'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {

    const { height } = this.state;
    const { config, slides } = data;

    // config for react slick
    const settings = {
      adaptiveHeight: false,
      arrows: false,
      autoplaySpeed: config.timeout,
      autoplay: true,
      centerPadding: 0,
      dots: false,
      infinite: true,
      speed: config.speed,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const offSetFullHeight = (height - 20) + 'px';
    const offSetHalfHeight = ((height - 24) * 0.5) + 'px';

    let slidesRender = [];

    // loop through each slides
    slides.forEach((slide, index) => {

      let contentsRender = [];
      const totalContents = slide.contents.length;
      let contentHeight = offSetFullHeight; // default all contents are full height
    
      if(totalContents > 2) {
        contentHeight = offSetHalfHeight;
      }

      // loop through each contents in this slide
      slide.contents.forEach((content, index) => {

        // prepare the UI accordingly based on the content type
        switch (content.type) {

          case 'image':
            // prepare image ui
            contentsRender.push(
              <div key={index} style={{ height: contentHeight, backgroundColor: 'black' }}>
                <div style={{
                  background: "url(" + content.value + ") no-repeat center center",
                  width: "100%",
                  height: "100%"
                }} />
              </div>
            );
            break;

          case 'url':
            // prepare url ui
            contentsRender.push(
              <div key={index} align="center">
                <iframe
                  title="adf"
                  width='100%'
                  height={contentHeight}
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  src={content.value}
                />
              </div>
            );
            break;

          default:
            break;
        }

      });

      slidesRender.push(
        <div key={index}>
          <Grid gap={0} style={{ margin: '0px' }}>
            {contentsRender}
          </Grid>
        </div>
      );

    });

    return(
      <Slider {...settings}>
        {slidesRender}
      </Slider>
    );
  }
}

export default App