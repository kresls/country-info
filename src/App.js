import './App.css';
import React from 'react';

// Helper function to provide current date formatted as "YYYY-MM-DD"
function GetFormattedDate() {
  let date = new Date();
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
}

// Handle timeouts, used in search bar
let timeouts = [];
function ClearAllTimeouts() {
  for(let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

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
      this.fetchWidgets(this.state.queryResult[0])
    }
    else if(this.state.suggestionsFound && e.target[2]) { // there is MORE THAN one country
      let index = e.target[2].selectedIndex
      let country = this.state.queryResult[index]
      this.fetchWidgets(country)
    }
    else { // there is no suggested country
      
    }
  }
  fetchWidgets = (country) => {
    this.clearForm()
    this.props.updateCountry({
      status: true,
      country: country
    })
  }
  clearForm = () => {
    this.setState({country: "", readyToQuery: false})
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
  keydown = (e) => {
    let selectList = e.target.parentElement[2]
    this.moveSelectOption(selectList, e)
    this.disableCursorMove(e)
  }
  disableCursorMove = (e) => {
    if(e.code === "ArrowDown" || e.code === "ArrowUp") {
      e.preventDefault()
    }
  }
  moveSelectOption = (selectList, e) => {
    if(e.code === "ArrowDown" && selectList && selectList.length > 1) { // When down key is pressed and select element exists
      if(selectList.selectedIndex === selectList.length - 1) { // moving down when at the bottom
        selectList.selectedIndex = 0
      }
      else {
        selectList.selectedIndex += 1
      }
    }
    else if(e.code === "ArrowUp" && selectList && selectList.length > 1) { // When up key is pressed and select element exists
      if(selectList.selectedIndex === 0) { // moving up when already at top
        selectList.selectedIndex = selectList.length - 1
      }
      else {
        selectList.selectedIndex -= 1
      }
    }
  }
  render() {
    return (
      <div className="form-wrapper">
        <form id="search-form" onSubmit={this.handleSubmitForm}>
          <input
            type="search"
            onChange={this.handleInputChange} 
            value={this.state.country}
            onKeyDown={this.keydown}
            className="search-bar-text"
            autoFocus={true}
          />
          <input
            type="submit"
            value="Search"
            onSubmit={this.handleSubmitForm}
            disabled={!this.state.suggestionsFound}
            className="search-bar-submit"
          />
          {this.state.readyToQuery ?
            <SearchSuggestions
              queryResult={this.state.queryResult}
              query={this.state.query} 
              updateQueryResult={this.updateQueryResult} 
              updateSuggestionsFound={this.updateSuggestionsFound}
            />
            : null
          }
        </form>
      </div>
    )
  }
}

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

class Holidays extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      holidaysFound: false,
      holidays: {}
    }
  }
  componentDidMount() {
    this.fetch()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.code !== this.props.code) {
      this.fetch()
    }
  }
  handleResult = (result) => {
    if(!result.status) { // Results found
      this.setState({
        holidaysFound: true,
        holidays: result
      })
    }
    else { // No results
      this.setState({
        holidaysFound: false,
        holidays: {}
      })
    }
  }
  fetch() {
    fetch(
      "https://date.nager.at/api/v2/publicholidays/" + new Date().getFullYear() + "/" + this.props.code)
      .then(res => res.json())
      .then(
        (result) => {
          this.handleResult(result)
        }
      )
  }
  render() {
    if(this.state.holidaysFound) {
      return (
        <div className="widget public-holidays">
          <h4>{new Date().getFullYear()} public holidays in {this.props.name}</h4>
        {this.state.holidays.map(function(holiday, index) {
          return (
            <div
              key={index}
              className="holiday-container">
                <span className="holiday-name">{holiday.name}</span><br />
                {holiday.name !== holiday.localName ? <span className="holiday-localname">{holiday.localName}<br /></span> : null}
                <span className="holiday-date">{holiday.date}</span><br /><br />
            </div>
          )
        }, this)}
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

export default App;
