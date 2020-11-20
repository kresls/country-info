import './App.css';
import React from 'react';
import SearchBar from './components/SearchBar';
import WidgetContainer from './components/WidgetContainer';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      countryPicked: {
        status: false,
        country: {}
      }
    }
  }
  updateCountry = (countryPicked) => {
    this.setState({
      countryPicked: countryPicked
    })
  }
  render() {
    return (
      <div className="app-wrap">
        <h1>Country viewer</h1>
        <SearchBar updateCountry={this.updateCountry} />
        {this.state.countryPicked.status ? <WidgetContainer country={this.state.countryPicked.country} /> : null }
      </div>
    )
  }
}

export default App;
