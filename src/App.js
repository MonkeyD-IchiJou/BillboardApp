import React from "react";
import Slider from "react-slick";
import { Grid } from 'semantic-ui-react'
import data from './data.json'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {

    const { height, width } = this.state;
    const { config, slides } = data;

    // config for react slick
    const settings = {
      infinite: true,
      autoplaySpeed: config.timeout,
      speed: config.speed,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      centerPadding: 0,
      adaptiveHeight: true,
      arrows: false,
      dots: false
    };

    const renderHeight = height + 'px';

    let slidesRender = [];

    // loop through each slides
    slides.forEach((slide, index) => {

      let contentsRender = [];

      // loop through each contents in this slide
      slide.contents.forEach((content, index) => {

        // prepare the UI accordingly based on the content type
        switch (content.type) {

          case 'image':

            // prepare image ui
            contentsRender.push(
              <Grid.Column key={index}>
                <div style={{ backgroundColor: 'black', height: renderHeight }}>

                  <div style={{ height: '0px', color: 'rgba(0, 0, 0, 0.0)' }}>ignore this</div>

                  <div style={{
                    background: "url(" + content.value + ") no-repeat center center",
                    width: "100%",
                    height: "100%",
                    position: 'relative'
                  }} />

                </div>
              </Grid.Column>
            );

            break;

          case 'url':

            // prepare url render ui
            contentsRender.push(
              <Grid.Column key={index}>
                <div style={{ backgroundColor: 'black', height: renderHeight }}>

                  <div style={{ height: '0px', color: 'rgba(0, 0, 0, 0.0)' }}>ignore this</div>

                  <div align="center">
                    <iframe
                      title="adf"
                      width={width + 'px'}
                      height={height - 4 + 'px'}
                      frameBorder="0"
                      marginHeight="0"
                      marginWidth="0"
                      src={content.value}>
                    </iframe>
                  </div>

                </div>
              </Grid.Column>
            );

            break;

          default:
            break;

        }

      })

      slidesRender.push(
        <div key={index}>
          <Grid columns={slide.contents.length} style={{ backgroundColor: 'black' }}>
            {contentsRender}
          </Grid>
        </div>
      );

    });

    return (
      <Slider {...settings}>
        {slidesRender}
      </Slider>
    );
  }
}

export default App;
