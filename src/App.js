import React from "react";
import Slider from "react-slick";
import Grid from 'react-css-grid';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      data: {}
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    const url = "https://s3-ap-southeast-1.amazonaws.com/billboardapp4wework/data.json"

    fetch(url)
      .then((resp) => resp.json()) // Transform the data into json
      .then((data) => {
        // set the data into my state
        this.setState({data: data})
      })
      .catch((e) => {
        // if got any errors
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {

    const { height, data } = this.state;

    // make sure the data is not empty
    if (data.config) {

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

        const totalContents = slide.contents.length;
        let contentHeight = offSetFullHeight; // default all contents are full height

        if (totalContents > 2) {
          contentHeight = offSetHalfHeight;
        }

        let contentsRender = [];

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

        let rowRender = [];

        let firstTwo = contentsRender.slice(0, 2);
        const gapsize = 4;

        rowRender.push(
          <Grid gap={gapsize} style={{ margin: '0px' }} key={0}>
            {firstTwo}
          </Grid>
        );

        let allLastContents = contentsRender.slice(2);
        if (allLastContents.length > 0) {
          rowRender.push(
            <Grid gap={gapsize} style={{ margin: '0px' }} key={1}>
              {allLastContents}
            </Grid>
          );
        }

        slidesRender.push(
          <div key={index}>
            {rowRender}
          </div>
        );

      });

      return (
        <Slider {...settings}>
          {slidesRender}
        </Slider>
      );
    }
    else {
      return(<div>loading</div>)
    }
  }
}

export default App