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
      country: "",
      query: "",
      readyToQuery: false,
      queryResult: [],
      suggestionsFound: false
    }
  }
  handleSubmitForm = (e) => {
    e.preventDefault()
    if(this.state.suggestionsFound && this.state.queryResult.length === 1) { // there is ONE country

    }
    else if(this.state.suggestionsFound) { // there is MORE THAN one country
      
    }
    else { // there is no country
      
    }

  }
  handleInputChange = (e) => {
    ClearAllTimeouts() // removes previously set timeouts so only one request is sent a time
    this.setState({
      country: e.target.value
    })
    // Delays the update of state.query with half a second
    // Makes sure no suggestions are fetched while typing
    timeouts.push(setTimeout(this.updateQuery, 500))
  }
  updateQuery = () => {
    let country = this.state.country
    this.setState({
      query: country,
      readyToQuery: true
    })
  }
  updateQueryResult = (queryResult) => {
    this.setState({
      queryResult: queryResult
    })
  }
  updateSuggestionsFound = (bool) => {
    this.setState({
      suggestionsFound: bool
    })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmitForm}>
          <input
            type="search"
            onChange={this.handleInputChange} 
            value={this.state.country}
          />
          <input
            type="submit"
            value="Search"
            onSubmit={this.handleSubmitForm}
            disabled={!this.state.suggestionsFound}
          />
        </form>
        {this.state.readyToQuery ? <SearchSuggestions queryResult={this.state.queryResult} query={this.state.query} updateQueryResult={this.updateQueryResult} updateSuggestionsFound={this.updateSuggestionsFound} /> : null }
      </div>
    )
  }
}

class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      errorMessage: "",
      isLoaded: false,
      queryResult: this.props.queryResult
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      console.log("fetching suggestions with query '" + this.props.query + "'")
      this.fetchSuggestions()
    }
    else if(this.props.queryResult !== prevProps.queryResult) {
      this.handleQueryResult()
    }
  }
  handleQueryResult = () => {
    if(this.props.queryResult.status) { // when there's an error message (no country found)
      this.setState({
        error: true,
        errorMessage: "No country found..",
        isLoaded: true,
        countries: this.props.queryResult
      })
      this.props.updateSuggestionsFound(false)
    }
    else { // when there's no error message
      const tempCountryArray = [];
      for(let country of this.props.queryResult) {
        tempCountryArray.push(country)
      }
      this.setState({
          isLoaded: true,
          error: false,
          errorMessage: "",
          countries: tempCountryArray
      })
      this.props.updateSuggestionsFound(true)
    }
  }
  componentDidMount() {
    console.log("fetching suggestions with query '" + this.props.query + "'")
    this.fetchSuggestions()
  }
  fetchSuggestions() {
    this.setState({isLoaded: false})
    if(this.props.query.trim() !== "") {
      fetch("https://restcountries.eu/rest/v2/name/" + this.props.query.trim())
      .then(res => res.json())
      .then(
        (result) => {
          this.props.updateQueryResult(result)
        }
      )
    }
    else { // empty string in search box
      this.setState({
        isLoaded: true,
        error: false,
        errorMessage: "",
        countries: []
      })
      this.props.updateSuggestionsFound(false)
    }
  }
  render() {
    if(this.state.error) { // If there's an error
      return <div>{this.state.errorMessage}</div>
    }
    else if(!this.state.isLoaded) { // If the state hasn't loaded
      return <div>Loading...</div>
    }
    else if(this.state.countries.length > 0) { // If suggestions have been found
        return (
            <div className="search-suggestions">
              {this.state.countries.map(function(country, index) {
                return (
                  <p key={index}>{country.name}</p>
                )
              }, this)}
            </div>
          )
      }
    else { // If there search box is empty
      return (
        <div className="search-suggestions suggestions-empty"></div>
      )
    }
  }
}

export default App;
