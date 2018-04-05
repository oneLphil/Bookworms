/**
 * Class that represents the search results view
 */
class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults : [],
            bookResults : []
        }
    }

    componentDidMount() {
        const request = async () => {
            let titleArg = this.props.text.trim().split(/\s+/).join("+");
            const response = await fetch("https://openlibrary.org/search.json?title=" + titleArg);
            if (!response.ok) throw "No data";
            const searchJson = await response.json();

            this.setState({ searchResults : searchJson.docs, });
        };

        request().catch(error => console.log(error));
    }

    render() {
        return (
            <div id="search-results">
                <h2>Search results for "{this.props.text}"</h2>
                <ul>
                    {this.state.searchResults.map(item => {
                        if (item.hasOwnProperty('isbn')) {
                            return (<SingleSearchResult key={item.key} data={item} username={this.props.username}/>)
                        }
                    })}
                </ul>
            </div>
        );
    }
}

/**
 * Renders a single search result
 */
class SingleSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.addToReadingList = this.addToReadingList.bind(this);
    }

    addToReadingList() {
        let isbn = this.props.data.isbn[0];
        if (this.props.username != '') {
            fetch('/users/' + this.props.username + '/books-to-read/' + isbn, {
                method : 'put'
            }).then((data) => {
                console.log(data);
                console.log(isbn);
                document.getElementById(isbn.toString()).textContent = 'Added';
            }).catch();
        }
    }

    render() {
        let isbn = this.props.data.isbn[0];
        return (
            <li className="search-result">

                <img src={"https://covers.openlibrary.org/b/id/" + this.props.data.cover_i + "-M.jpg"} className="book-cover"/>

                <div className="record-details">

                    <h3 className="title">{this.props.data.title}</h3>

                    <span className="authors">
                        Author(s): {(authors => {
                            if (authors) return authors.join(", ");
                            else return "Unknown";
                        })(this.props.data.author_name)}
                        </span>

                    <p className="description">{this.props.desc}</p>
                    {(() => {
                        if (this.props.username != '') {
                            return (
                                <button onClick={this.addToReadingList} id={isbn.toString()} className="btn-secondary">Add to reading list</button>
                            );
                        }
                    })()}
                </div>
            </li>
        );
    }
}
