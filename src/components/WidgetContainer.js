import React from 'react';
import SunriseSunset from './SunriseSunset';
import Holidays from './Holidays';
import Books from './Books';
import Money from './Money';
import Namedays from './Namedays';

class WidgetContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      country: this.props.country
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.country !== this.props.country) {
      this.setState({
        country: this.props.country
      })
    }
  }
  render() {
    return (
      <div>
        <div className="currently-showing">Currently showing country: {this.props.country.name}</div>
        <div className="widget-container">
          <Holidays code={this.state.country.alpha2Code} name={this.state.country.name} />
          <SunriseSunset country={this.state.country} />
          <Books country={this.state.country} />
          <Namedays country={this.state.country} />
          <Money country={this.state.country} />
        </div>
      </div>
    )
  }
}

export default WidgetContainer;