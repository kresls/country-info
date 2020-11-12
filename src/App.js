import './App.css';
import React from 'react';

let timeouts = [];

function ClearAllTimeouts() {
  for(let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Country viewer</h1>
        <SearchBar />
      </div>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      country: ""
    }
  }
  handleSubmitForm = (e) => {
    e.preventDefault()
    console.log(this.state.country)
  }
  handleInputChange = (e) => {
    ClearAllTimeouts() // removes previously set timeouts so only one request is sent a time
    this.setState({country: e.target.value})
    timeouts.push(setTimeout(this.tryTimer, 500))
  }
  tryTimer = () => {
    console.log("timer triggered")
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmitForm}>
          <input
            type="text"
            onChange={this.handleInputChange} 
            value={this.state.country}
          />
          <input
            type="submit"
            value="Search"
            onSubmit={this.handleSubmitForm}
          />
        </form>
      </div>
    )
  }
}

export default App;
