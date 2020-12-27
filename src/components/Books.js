import React from 'react';

class Books extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataExists: false
    }
  }
  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.country !== this.props.country) {
      this.setState({
        dataExists: false
      })
      this.fetchData()
    }
  }
  fetchData() {
    fetch("http://openlibrary.org/search.json?q=" + this.props.country.name)
    .then(res => res.json())
    .then(
      (result) => {
        if(result.numFound > 0) { // books exist
          this.setState({
            dataExists: true,
            books: result.docs
          })
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
    if(this.state.dataExists) {
      return (
        <div className="widget books">
          <h4>Books from Open Library related to {this.props.country.name}</h4>
          {this.state.books.slice(0,10).map(function(book, index) {
            let authors = "";
            for(let i = 0; i < book.author_name.length; i++) {
              authors += book.author_name[i];
              if(i !== book.author_name.length - 1) {
                authors += ", ";
              }
            }
            return (
              <p key={index}>
                <span className="book-title">{book.title}</span> by {authors}
              </p>
            )
          })}
        </div>
      )
    }
    else {
      return ( null )
    }
  }
}

export default Books;