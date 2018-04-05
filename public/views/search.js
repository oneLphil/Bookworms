/**
 * Class that represents the search results view
 */
class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            bookResults: []
        };
    }

    componentDidMount() {
        const request = async () => {
            let titleArg = this.props.text.trim().split(/\s+/).join("+");
            const response = await fetch("https://openlibrary.org/search.json?title=" + titleArg);
            if (!response.ok) throw "No data";
            const searchJson = await response.json();

            this.setState({ searchResults: searchJson.docs });
        };

        request().catch(error => console.log(error));
    }

    render() {
        return React.createElement(
            "div",
            { id: "search-results" },
            React.createElement(
                "h2",
                null,
                "Search results for \"",
                this.props.text,
                "\""
            ),
            React.createElement(
                "ul",
                null,
                this.state.searchResults.map(item => {
                    if (item.hasOwnProperty('isbn')) {
                        return React.createElement(SingleSearchResult, { key: item.key, data: item, username: this.props.username });
                    }
                })
            )
        );
    }
}

/**
 * Renders a single search result
 */
class SingleSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.addToReadingList = this.addToReadingList.bind(this);
    }

    addToReadingList() {
        let isbn = this.props.data.isbn[0];
        if (this.props.username != '') {
            fetch('/users/' + this.props.username + '/books-to-read/' + isbn, {
                method: 'put'
            }).then(data => {
                console.log(data);
                console.log(isbn);
                document.getElementById(isbn.toString()).textContent = 'Added';
            }).catch();
        }
    }

    render() {
        let isbn = this.props.data.isbn[0];
        return React.createElement(
            "li",
            { className: "search-result" },
            React.createElement("img", { src: "https://covers.openlibrary.org/b/id/" + this.props.data.cover_i + "-M.jpg", className: "book-cover" }),
            React.createElement(
                "div",
                { className: "record-details" },
                React.createElement(
                    "h3",
                    { className: "title" },
                    this.props.data.title
                ),
                React.createElement(
                    "span",
                    { className: "authors" },
                    "Author(s): ",
                    (authors => {
                        if (authors) return authors.join(", ");else return "Unknown";
                    })(this.props.data.author_name)
                ),
                React.createElement(
                    "p",
                    { className: "description" },
                    this.props.desc
                ),
                (() => {
                    if (this.props.username != '') {
                        return React.createElement(
                            "button",
                            { onClick: this.addToReadingList, id: isbn.toString(), className: "btn-secondary" },
                            "Add to reading list"
                        );
                    }
                })()
            )
        );
    }
}