import React from 'react';

class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      errorMessage: "",
      isLoaded: false,
      queryResult: this.props.queryResult,
      countries: []
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      //console.log("fetching suggestions with query '" + this.props.query + "'")
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
    //console.log("fetching suggestions with query '" + this.props.query + "'")
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
      return (
        <select form="search-form" className="search-suggestions">
            <option>{this.state.errorMessage}</option>
        </select>
      )
    }
    else if(!this.state.isLoaded) { // If the state hasn't loaded
      return (
        <select form="search-form" className="search-suggestions">
            <option>Loading..</option>
        </select>
      )
    }
    else if(this.state.countries.length > 0) { // If suggestions have been found
        return (
            <select size={this.state.countries.length} form="search-form" className="search-suggestions no-scroll">
              {this.state.countries.map(function(country, index) {
                return (
                  <option key={index}>{country.name}</option>
                )
              }, this)}
            </select>
          )
      }
    else { // If the search box is empty
      return (
        <select form="search-form" className="search-suggestions suggestions-empty">
        </select>
      )
    }
  }
}

export default SearchSuggestions;