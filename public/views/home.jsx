class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText : ""

        };
        this.searchBarChanged = this.searchBarChanged.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
    }


    render() {
        return (
            <div className="main home">

            	<div id="circle">
  					<div id="main-rec">
    					<div id="inner-rec"></div>
    					<div id="inner-rec-2"></div>
    					<div id="inner-rec-3"></div>
					</div>
				</div>

                <p className="intro-text"> Welcome avid reader </p>
                <p> You're <em>seconds</em> away from finding your next read. </p>
                <div className="search-call-to-action">
                	<input placeholder="Search by title, subject or author" id="search-bar" onChange={this.searchBarChanged}/>
                	<button id="search-button" onClick={this.buttonClicked}>Search</button>
                </div>
            </div>
        );
    }
    searchBarChanged(e) {
        this.setState({ searchText : e.target.value });
    }
    buttonClicked(e) {
        let buttonId = e.target.id;
        if (buttonId == "search-button") {
            this.props.changeViewFunc("searchResults", { text : this.state.searchText });
        }
    }
}
