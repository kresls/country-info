import React from 'react';

class Money extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataExists: false,
      rates: null
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
  prepareOutput() {
    if(this.state.dataExists) {
      let rate = this.state.rates[this.props.country.currencies[0].code];
      if(rate) {
        this.setState({
          countryRateExists: true,
          rate: rate
        })
      }
      else {
        this.setState({
          countryRateExists: false
        })
      }
    }
  }
  fetchData() {
    fetch("https://api.exchangeratesapi.io/latest?base=USD")
    .then(res => res.json())
    .then(
      (result) => {
        if(result.rates) {
          this.setState({
            dataExists: true,
            rates: result.rates
          })
          this.prepareOutput()
        }
        else {
          this.setState({
            dataExists: false
          })
        }
      }
    )
  }
  render() {
    if(this.state.countryRateExists) {
      return (
        <div className="widget books">
          <h4>Money</h4>
          <p>1 USD = {this.state.rate} {this.props.country.currencies[0].code}</p>
        </div>
      )
    }
    else {
      return ( null )
    }
  }
}

export default Money;