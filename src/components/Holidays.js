import React from 'react';

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

export default Holidays;