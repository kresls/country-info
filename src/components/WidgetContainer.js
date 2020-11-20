import React from 'react';
import SunriseSunset from './SunriseSunset';
import Holidays from './Holidays';

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
      <div className="widget-container">
        <Holidays code={this.state.country.alpha2Code} name={this.state.country.name} />
        <SunriseSunset country={this.state.country} />
      </div>
    )
  }
}

export default WidgetContainer;