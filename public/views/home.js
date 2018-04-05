class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ""

        };
        this.searchBarChanged = this.searchBarChanged.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    render() {
        return React.createElement(
            "div",
            { className: "main home" },
            React.createElement(
                "div",
                { id: "circle" },
                React.createElement(
                    "div",
                    { id: "main-rec" },
                    React.createElement("div", { id: "inner-rec" }),
                    React.createElement("div", { id: "inner-rec-2" }),
                    React.createElement("div", { id: "inner-rec-3" })
                )
            ),
            React.createElement(
                "p",
                { className: "intro-text" },
                " Welcome avid reader "
            ),
            React.createElement(
                "p",
                null,
                " You're ",
                React.createElement(
                    "em",
                    null,
                    "seconds"
                ),
                " away from finding your next read. "
            ),
            React.createElement(
                "div",
                { className: "search-call-to-action" },
                React.createElement("input", { placeholder: "Search by title, subject or author", id: "search-bar", onChange: this.searchBarChanged }),
                React.createElement(
                    "button",
                    { id: "search-button", onClick: this.buttonClicked },
                    "Search"
                )
            )
        );
    }
    searchBarChanged(e) {
        this.setState({ searchText: e.target.value });
    }
    buttonClicked(e) {
        let buttonId = e.target.id;
        if (buttonId == "search-button") {
            this.props.changeViewFunc("searchResults", { text: this.state.searchText });
        }
    }
}