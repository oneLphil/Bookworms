let componentKey = 0;

class BookwormsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewShown: "home",
            viewArgs: {}
        };
        this.username = '';
        this.changeView = this.changeView.bind(this);
        this.setLoggedInUser = this.setLoggedInUser.bind(this);
    }

    componentDidMount() {
        const session_request = async () => {
            let response = await fetch('/get-session', {
                method: 'get',
                credentials: 'include'
            });
            let data = await response.text();
            this.username = data;
            this.forceUpdate();
        };
        session_request().catch(() => console.log('Error'));
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(NavigationAndSearchBar, { changeViewFunc: this.changeView, setLoggedInUserFunc: this.setLoggedInUser,
                changeViewFunc: this.changeView, username: this.username }),
            React.createElement(ViewCanvas, { view: this.state.viewShown, args: this.state.viewArgs, changeViewFunc: this.changeView, setLoggedInUserFunc: this.setLoggedInUser, username: this.username })
        );
    }

    changeView(view, args) {
        this.setState({ viewShown: view, viewArgs: args });
    }

    setLoggedInUser(user) {
        this.username = user;
        this.forceUpdate();
    }
}

class NavigationAndSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ""
        };
        this.searchBarChanged = this.searchBarChanged.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    render() {
        return React.createElement(
            'div',
            { id: 'header' },
            React.createElement(
                'div',
                { className: 'main-nav' },
                React.createElement(
                    'a',
                    { href: '', id: 'home-button', onClick: this.buttonClicked },
                    'Home'
                ),
                React.createElement(
                    'a',
                    { href: '', className: this.props.username === "" ? "btn-inactive" : "", id: 'profile-button', onClick: this.buttonClicked },
                    'Profile'
                ),
                React.createElement(
                    'a',
                    { href: '', id: 'community-button', onClick: this.buttonClicked },
                    'Community'
                ),
                React.createElement(
                    'a',
                    { href: '', id: 'login-button', onClick: this.buttonClicked },
                    function (username) {
                        console.log(username);
                        if (username == '') return 'Login';else return 'Logout';
                    }(this.props.username)
                )
            ),
            React.createElement(
                'div',
                { className: 'search-form' },
                React.createElement('input', { id: 'search-bar', placeholder: 'Search for a book to read', onChange: this.searchBarChanged }),
                React.createElement(
                    'button',
                    { id: 'search-button', onClick: this.buttonClicked },
                    'Search'
                )
            )
        );
    }

    searchBarChanged(e) {
        this.setState({ searchText: e.target.value });
    }

    logOut() {
        fetch('/logout', {
            method: 'get',
            credentials: 'include'
        }).then(data => {
            this.props.setLoggedInUserFunc('');
            this.props.changeViewFunc('home', {});
        }).catch();
    }

    buttonClicked(e) {
        e.preventDefault();
        let buttonId = e.target.id;

        if (buttonId == "home-button") {
            this.props.changeViewFunc("home", {});
        } else if (buttonId == "profile-button") {
            if (this.props.username != '') this.props.changeViewFunc("profile", { currentUser: this.props.username });
        } else if (buttonId == "community-button") {
            this.props.changeViewFunc("community", {
                thrdId: 0,
                currentView: "CommunitiesLanding",
                prevView: ""
            });
        } else if (buttonId == "login-button") {
            if (this.props.username == '') this.props.changeViewFunc("login", {});else this.logOut();
        } else {
            this.props.changeViewFunc("searchResults", { text: this.state.searchText });
        }
    }
}

function ViewCanvas(props) {
    componentKey += 1;
    if (props.view == "home") {
        return React.createElement(Home, { key: componentKey, changeViewFunc: props.changeViewFunc });
    } else if (props.view == "profile") {
        return React.createElement(ProfileView, { username: props.username, currentUser: props.args.currentUser, changeViewFunc: props.changeViewFunc, key: componentKey });
    } else if (props.view == "community") {
        return React.createElement(CommunitiesView, { username: props.username, key: componentKey, changeViewFunc: props.changeViewFunc, thrdId: props.args.thrdId, currentView: props.args.currentView, prevView: props.args.prevView });
    } else if (props.view == "login") {
        return React.createElement(LoginResults, { key: componentKey, changeViewFunc: props.changeViewFunc, setLoggedInUserFunc: props.setLoggedInUserFunc });
    } else if (props.view == "register") {
        return React.createElement(Register, { key: componentKey, changeViewFunc: props.changeViewFunc });
    } else {
        return React.createElement(SearchResults, { key: componentKey, text: props.args.text, username: props.username });
    }
}

ReactDOM.render(React.createElement(BookwormsApp, null), document.getElementById('root'));