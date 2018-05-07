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
        this.setState({ data: data })
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

      const offSetFullHeight = height + 'px';
      const offSetHalfHeight = (height * 0.5) + 'px';

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
                <div key={index} style={{
                  background: "url(" + content.value + ") no-repeat center center",
                  width: "100%",
                  height: contentHeight,
                  backgroundSize: content.size ? content.size : '100%'
                }} />
              );
              break;

            case 'url':
              // prepare url ui
              contentsRender.push(
                <iframe
                  title="adf"
                  width='100%'
                  height={contentHeight}
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  src={content.value}
                  key={index}
                />
              );
              break;

            default:
              break;
          }

        });

        let rowsRender = [];
        const gapsize = 4;

        // get the first 2 contents
        let firstRow = contentsRender.slice(0, 2);
        
        rowsRender.push(
          <Grid gap={gapsize} style={{ margin: '0px', overflow: 'hidden' }} key={0}>
            {firstRow}
          </Grid>
        );

        // get the last 2 contents
        let secondRow = contentsRender.slice(2);
        if (secondRow.length > 0) {
          rowsRender.push(
            <Grid gap={gapsize} style={{ margin: '0px', overflow: 'hidden' }} key={1}>
              {secondRow}
            </Grid>
          );
        }

        slidesRender.push(
          <div key={index}>
            {rowsRender}
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
      return (<div>loading</div>)
    }
  }
}

export default App