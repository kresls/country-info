import React from 'react';


class SunriseSunset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataExists: false,
      sunrise: "",
      sunset: ""
    }
  }
  componentDidMount() {
    this.fetchWOEID()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.country !== this.props.country) {
      this.fetchWOEID()
    }   
  }
  handleResult = (result) => {

    this.setState({
      dataExists: true,
      sunrise: this.getFormattedTime(result.sun_rise),
      sunset: this.getFormattedTime(result.sun_set)
    })
  }
  getFormattedTime(str) {
    str = str.split("T")
    str = str[1].split(".")
    return str[0]
  }
  fetchData(woeid) {
    fetch(
      "https://www.metaweather.com/api/location/" + woeid)
      .then(res => res.json())
      .then(
        (result) => {
          this.handleResult(result)
        }
      )
  }
  fetchWOEID() {
    fetch(
      "https://www.metaweather.com/api/location/search/?query=" + this.props.country.capital)
      .then(res => res.json())
      .then(
        (result) => {
          if(result[0]) { // If the capital city has weather data
            this.fetchData(result[0].woeid)
          }
          else {
            this.setState({
              dataExists: false,
              sunrise: "",
              sunset: ""
            })
          }
        }
      )
  }
  render() {
    if(this.state.dataExists) {
      return (
        <div className="widget sunrise-sunset">
          <h4>Weather information in capital city {this.props.country.capital}</h4>
          <p className="sunrise-text">Sunrise: {this.state.sunrise}</p>
          <p className="sunset-text">Sunset: {this.state.sunset}</p>
        </div>
      )
    }
    else {
      return (
        null
      )
    }
  }
}

export default SunriseSunset;