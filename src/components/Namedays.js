import React from 'react';

class Namedays extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      countryDataExists: false,
      data: null,
      names: ""
    }
  }
  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.country !== this.props.country) {
      this.prepareOutput()
    }
  }
  fetchData() {
    fetch("https://api.abalin.net/today")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          data: result.data
        })
        this.prepareOutput()
      }
    )
  }
  prepareOutput() {
    let names = this.state.data.namedays[this.props.country.alpha2Code.toLowerCase()];
    if(names) {
      this.setState({
        countryDataExists: true,
        names: names
      })
    }
    else {
      this.setState({
        countryDataExists: false,
        names: ""
      })
    }
  }
  render() {
    if(this.state.countryDataExists) {
      return (
        <div className="widget namedays">
          <h4>Today's namedays</h4>
          <p>{this.state.names}</p>
        </div>
      )
    }
    else {
      return ( null )
    }
  }
}

export default Namedays;