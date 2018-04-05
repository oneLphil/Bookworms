//temporary books read list
var booksISBN = ["0451225244", "9780756404079"]
var readingListISBN = ["2070643050", "0747581428"]

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : "PersonalInfo",
        };
        this.changeView = this.changeView.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        let username =  document.getElementById("search-profile-input").value;
        const request = async () => {
            const response = await fetch('/users/' + username);
            const data = await response.json();
            if (data == undefined || data.length == 0) {
                this.props.changeViewFunc("profile", {currentUser : ''});
            }
            else {
                this.props.changeViewFunc("profile", {currentUser : username});
            }
        };
        request().catch();
    }

    render() {
        if (this.props.currentUser == '') {
            return (<p>No User Found</p>);
        }
        return (
            <div className="profile">
                View another profile:
                <form className="profile-search-form" onSubmit={this.submitForm}>
                    <input id="search-profile-input" type="text"></input>
                    <button id="search-profile-button" type="submit">Search</button>
                </form>
                <br/>
                <ProfileNavigation changeView={this.changeView}/>
                <ProfileSubviewControl
                    username={this.props.username}
                    currentUser={this.props.currentUser}
                    currentView={this.state.currentView}
                    booksISBN={booksISBN}
                    readingListISBN={readingListISBN}
                    changeViewFunc={this.props.changeViewFunc}/>
            </div>
        );
    }

    changeView(view) {
    	this.setState({ currentView : view });
    }
}

class ProfileNavigation extends React.Component {
	constructor(props) {
        super(props);
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    render() {
        return (
            <div className="profile-nav">
                <img className="profile-image" src={"./profile-placeholder.png"}/>
                <ul>
                    <li><a href="" id="PersonalInfo" onClick={this.buttonClicked}>Personal Information</a></li>
                    <li><a href="" id="BooksRead" onClick={this.buttonClicked}>Books Read</a></li>
                    <li><a href="" id="ReadingList" onClick={this.buttonClicked}>Reading List</a></li>
                    <li><a href="" id="ReadingCommunities" onClick={this.buttonClicked}>My Reading Communities</a></li>
                </ul>
            </div>
        )
    }

	buttonClicked(e) {
        e.preventDefault();
        this.props.changeView(e.target.id);
    }

}

function ProfileSubviewControl(props) {
    if (props.currentView == "PersonalInfo") {
        return (<div className="subpanel-container">
                    <h2>My Profile</h2>
                    <ul>
                        <li><b>{props.currentUser}</b></li>
                    </ul>
                </div>);
    }
    else if (props.currentView == "BooksRead") {
        return (<div className="subpanel-container">
                    <h2>Books Read</h2>
                    <ul className="booklist">
                        <BookList bookList={props.booksISBN} username={props.username} currentUser={props.currentUser}/>
                    </ul>
                </div>);
    }
    else if (props.currentView == "ReadingList") {
        return (<div className="subpanel-container">
                    <h2>Reading List</h2>
                    <ul className="booklist">
                        <ReadingList bookList={props.readingListISBN} username={props.username} currentUser={props.currentUser}/>
                    </ul>
                </div>);
    }
    else if (props.currentView == "ReadingCommunities") {
        return (<div className="subpanel-container">
                    <h2>My Reading Communities</h2>
                    <MyCommunities currentUser={props.currentUser} changeViewFunc={props.changeViewFunc}/>
                </div>);
    }
    else {
        return (<div className="subpanel-container"><h2>Error Has Occured. We should not be here.</h2></div>);
    }
}

class MyCommunities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comm_list : []
        };
    };

    componentDidMount() {
        fetch('/users/' + this.props.currentUser)
        .then(res => {
            return res.json();
        })
        .then(json => {
            const get_comms = async () => {
                for (let i = 0; i < json[0].communities.length; i++) {
                    const comm_req = await fetch('/communities/' + json[0].communities[i]);

                    if (comm_req.ok) {
                        const data = await comm_req.json();
                        this.state.comm_list.push(data[0]);
                        this.forceUpdate();
                    }
                }
                console.log(this.state.comm_list);
            };
            get_comms().catch();
        })
        .catch(e => this.setState({books : []}));
    }

    render() {
        return(
            <ul>
                {this.state.comm_list.map((comm) => {
                    return (
                        <li>
                            <h3 style={{"marginBottom": 0}}>{comm.name}</h3>
                            <p>{comm.description}</p>
                            <button onClick={()=>{
                                this.props.changeViewFunc("community", {
                                    thrdId : comm._id,
                                    currentView : "Thread",
                                    prevView : ""
                                })
                            }} className="btn-secondary" type="button">Go to Thread</button>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: []
        }
    };

    componentDidMount() {
        fetch('/users/' + this.props.currentUser)
        .then(res => {
            return res.json();
        })
        .then(json => {
            let books_to_read_str = json[0].books_read.join();
            fetch('https://openlibrary.org/api/books?bibkeys=' + books_to_read_str + '&format=json&jscmd=data')
            .then(res => {
                return res.json();
            })
            .then(json => {
                let new_books = [];
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let new_item = {};
                        new_item[key] = json[key];
                        new_books.push(new_item);
                    }
                }
                this.setState({books : new_books});
            })
            .catch(e => this.setState({books : []}));
        })
        .catch(e => this.setState({books : []}));
    }

    render() {
        if (this.state.books){
            return (
                this.state.books.map((book, index) => {
                    return(
                        <li className='book-list' key={index}>
                            <img className="book-cover" src={
                                (() => {
                                    let obj = Object.values(book)[0];
                                    if (obj.hasOwnProperty('cover')) {
                                        if (obj.cover.hasOwnProperty('medium'))
                                            return obj.cover.medium;
                                        else return 'undefined';
                                    }
                                    else return 'undefined';
                                })()
                            }/>
                            <div className="book-details">
                                <h3 className="title">{Object.values(book)[0].title}</h3>
                                <p className="author">{
                                    (() => {
                                        let obj = Object.values(book)[0];
                                        let authors_lst = [];
                                        for (let key in obj.authors) {
                                            authors_lst.push(obj.authors[key].name);
                                        }
                                        return authors_lst.join(', ');
                                    })()
                                }</p>
                            </div>
                        </li>
                    )
                })
            )
        }
    }
}

class ReadingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: []
        }
        this.addToReadingList = this.addToReadingList.bind(this);
    };

    addToReadingList(isbn) {
        if (this.props.username != '') {
            fetch('/users/' + this.props.username + '/books-read/' +isbn, {
                method : 'put'
            }).then((data) => console.log(data)).catch();

            fetch('/users/' + this.props.username + '/books-to-read/' +isbn, {
                method : 'delete'
            }).then((data) => {
                console.log(data);
                this.componentDidMount();
            }).catch();
        }
    }

    componentDidMount() {
        fetch('/users/' + this.props.currentUser)
        .then(res => {
            return res.json();
        })
        .then(json => {
            let books_to_read_str = json[0].books_to_read.join();
            fetch('https://openlibrary.org/api/books?bibkeys=' + books_to_read_str + '&format=json&jscmd=data')
            .then(res => {
                return res.json();
            })
            .then(json => {
                let new_books = [];
                for (let key in json) {
                    if (json.hasOwnProperty(key)) {
                        let new_item = {};
                        json[key]['isbn'] = key.toString();
                        new_item[key] = json[key];
                        new_books.push(new_item);
                    }
                }
                this.setState({books : new_books});
            })
            .catch(e => this.setState({books : []}));
        })
        .catch(e => this.setState({books : []}));
    }

    render() {
        if (this.state.books){
            return (
                this.state.books.map((book, index) => {
                    return(
                        <li className='book-list' key={index}>
                            <img className="book-cover" src={
                                (() => {
                                    let obj = Object.values(book)[0];
                                    if (obj.hasOwnProperty('cover')) {
                                        if (obj.cover.hasOwnProperty('medium'))
                                            return obj.cover.medium;
                                        else return 'undefined';
                                    }
                                    else return 'undefined';
                                })()
                            }/>
                            <div className="book-details">
                                <h3 className="title">{Object.values(book)[0].title}</h3>
                                <p className="author">{
                                    (() => {
                                        let obj = Object.values(book)[0];
                                        let authors_lst = [];
                                        for (let key in obj.authors) {
                                            authors_lst.push(obj.authors[key].name);
                                        }
                                        return authors_lst.join(', ');
                                    })()
                                }</p>
                                {(() => {
                                    if (this.props.username == this.props.currentUser) {
                                        return (
                                            <button onClick={()=>{
                                                this.addToReadingList(Object.values(book)[0].isbn);
                                            }} className="btn-secondary" type="button">Has Read</button>
                                        );
                                    }
                                })()}
                            </div>
                        </li>
                    )
                })
            )
        }
    }
}
