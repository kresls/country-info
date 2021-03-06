import React from 'react';
import SearchSuggestions from './SearchSuggestions';

// Handle timeouts, used in search bar
let timeouts = [];
function ClearAllTimeouts() {
  for(let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
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

export default SearchBar;