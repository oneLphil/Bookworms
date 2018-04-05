var date = new Date();
date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

class CommunitiesView extends React.Component {

	constructor(props) {
        super(props);

        this.state = {
        	user : this.props.username,
        	thrdId : this.props.thrdId,
        	currentView: this.props.currentView,
        	prevView: this.props.prevView
        };

        this.changeView = this.changeView.bind(this);
        this.updateThrdId = this.updateThrdId.bind(this);
    }

    changeView(view) {
    	this.setState({prevView : this.state.currentView})
    	this.setState({ currentView : view });
    }

    updateThrdId(id){
    	this.setState({ thrdId : id });
    }

    render() {
        return (
                <CommunitiesSubviewControl
                	changeView={this.changeView}
                	currentView={this.state.currentView}
                	prevView={this.state.prevView}
                	updateThrdId={this.updateThrdId}
                	currentThrdId={this.state.thrdId}
                	user={this.state.user}
                />
        );
    }

}

function CommunitiesSubviewControl(props) {

    if (props.currentView === "CommunitiesLanding") {
        console.log("On the communities landing page");
        return(<ThreadsList changeView={props.changeView} updateThrdId={props.updateThrdId}/>)
    }
    else if (props.currentView === "Thread") {
        console.log("In a thread id: " + props.currentThrdId);
        if (props.currentThrdId){
        	// Return the discussion window here with all messages
        	return(<div className="subpage"><DiscussionWindow user={props.user} thrdid={props.currentThrdId}/></div>)
        } else {
        	// Invalid thread id provided
        	return(
        		<div className="subpage">
        		<div className="alert">
        			<h2> Sorry! Couldn't find that thread =( </h2>
        			<p> Why don't you try another ? </p>
        		</div>
        		</div>
        	)
        }
    }
    else if (props.currentView === "NewThread"){

    	// Is the user logged in?
    	if (props.user) {
    		return(<div className="subpage"><NewThreadForm user={props.user} changeView={props.changeView}/></div>)
    	} else {
    		return(
    			<div className="subpage">
    				<h2 className="alert"> Please login before creating a discussion. </h2>
    			</div>
    		)
    	}
    }
    else {
        console.log("Can't recognize subview: " + props.currentView);
        return(
        	<div className="subpage"><h2 className="alert"> Whoops! broken page ... hmmm ... =( </h2></div>
        )
    }
}

class ThreadsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            threads: []
        }

        this.getThread = this.getThread.bind(this);
        this.createThread = this.createThread.bind(this);

    };

    componentDidMount() {

       console.log("Fetching threads");

       const thread_request = async () => {
            let response = await fetch('/communities', {
                method : 'get'
            });
            let data = await response.json();
            console.log(data);
            this.setState({threads : data});
        };

        thread_request().catch((err) => console.log('Err getting threads: ' + thread_request));

    }


    // Render the discussion window base on thread id
    getThread(e) {
    	e.preventDefault();
    	console.log("Button clicked with thrdid: ", e.target.id);
    	this.props.updateThrdId(e.target.id);
		this.props.changeView("Thread");
    }

    createThread(e) {
		e.preventDefault();
		console.log("Want to create another thread");
		this.props.changeView("NewThread");
	}

    render() {
    	console.log(this.state.threads.length);
        if (this.state.threads){
        	// List of active discussion threads
        	var list = this.state.threads.map((thread, index) => {
        				return(
                        <li className="search-result" key={index}>
                            <h3 className="title">{Object.values(thread)[1]}</h3>
                            <p className="description"> {Object.values(thread)[3]} </p>
                            <p className="authors"> Discussion creator: {Object.values(thread)[2]} </p>
                            <p className="date">{Object.values(thread)[4]} </p>
                            <button id={Object.values(thread)[0]} className="btn-secondary" onClick={this.getThread}>Join discussion</button>
                        </li>
                    	)
                	});

            return (
            	<div id="search-results">
            		<h2>Community</h2>
        			<p> See what other members are reading and talking about. Browse the selection below and <strong>join the discussion</strong>.</p>
					<div className="com-create">
            			<p> <strong> Not interested in any? Create your own, easy peesy.</strong></p>
            			<button className="btn-primary start-dsc" onClick={this.createThread} value="Create Discussion">Start a discussion</button>
					</div>
            		<ul> {list} </ul>
            	</div>
            )

        } else {
        	return (
        		<div className="alert">
        			<h2> No active discussions at this time. Why don't you start one?!</h2>
        			<input className="btn-primary" type="submit" onClick={this.createThread} value="Create Discussion"/>
        		</div>
        	)
        }
    }
}

class NewThreadForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	newthrdId: 0
        }

        this.name = '';
        this.admin = this.props.user;
        this.description = '';

        this.submitForm = this.submitForm.bind(this);
        this.successfulPost = this.successfulPost(this);
    };

	submitForm(e){

        e.preventDefault();

        console.log("Pushing test records");

    	console.log(date);
    	const post_com = async () => {
    		const response = await fetch('/communities', {
                method : 'post',
                headers: {'Content-Type' : 'application/json'},
                body : JSON.stringify({
                    name : this.name,
                    admin : this.admin,
                    description : this.description,
                    time : date
                })
            });

            const data = await response.json();
            console.log(data);

            if(response.ok){
				const add_comm = await fetch('/users/' + this.admin + '/community/' + data._id, {method : 'put'});
            	this.props.changeView("CommunitiesLanding");
            }

            //this.setState({msg : Object.values(data)[0]});
            //document.getElementById('register-form').reset();
    	}


    	post_com().catch((error) => {
            console.log("Err posting comunity: " + error);
        });

	}

	successfulPost(){
		// Goto communities landing page
	}

	render() {

        return (
            <div className="register-container">

                <h2>Create a Discussion</h2>

                <form id="register-form" onSubmit={this.submitForm}>
                    <label>User</label>
                    <input type="text" name="username" value={this.props.user} disabled/>

                    <label>Discussion title</label>
                    <input type="text" name="email" onChange={(e) => {
                        this.name = e.target.value;
                    }}/>

                    <label>Theme of discussion</label>
                    <textarea name="description" onChange={(e) => {
                        this.description = e.target.value;
                    }}/>

                    <input className="btn-primary" type="submit" value="Create" onChange={this.submitForm}/>
                </form>
            </div>
        );

	}

}

/* Component that displays messages between users */

class DiscussionWindow extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	user: this.props.user,
        	thrdid: this.props.thrdid,
        	dsc_path: "/communities/" + this.props.thrdid,
        	thread_name: "",
            thread_msgs: [],
            err_msg: "",
            msg_len: 0
        }

        this.getThreadMessages = this.getThreadMessages.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.comment = "";

    };


    componentDidMount() {

		// Get relevant discussion thread related to this thread id
		this.getThreadMessages();

    }

    getThreadMessages(){

    	const thread_request = async () => {
            let response = await fetch(this.state.dsc_path, {
                method : 'get'
            });
            let data = await response.json();
            this.setState({thread_name : data[0]["name"]});
            this.setState({thread_msgs : data[0]["messages"]});
            this.setState({msg_len : data[0]["messages"].length});
            //console.log(this.state.thread_msgs[0]["messages"]);
        };

        thread_request().catch((err) => console.log('Err getting threads: ' + thread_request));

    }

    postMessage(e){

    	e.preventDefault();

    	const post_com = async () => {
    		const response = await fetch(this.state.dsc_path, {
                method : 'post',
                headers: {'Content-Type' : 'application/json'},
                body : JSON.stringify({
                    user : this.state.user,
                    message : this.comment,
                    time : date
                })
            });

            const data = await response.json();
            console.log(data);

            if(data["ok"]){
            	this.getThreadMessages();
				await fetch('/users/' + this.state.user + '/community/' + this.state.thrdid, {method : 'put'});
            } else {
            	this.setState({err_msg : "Oh no couldn't retrieve any messages. Try again later."});
            }
    	}

    	post_com().catch((error) => {
            console.log("Posting community message: " + error);
        });

    }

    render() {

    	// Enable commenting only for users who are logged in
    	var comments_enabled = this.state.user ? 1 : 0
    	var messages = Object.values(this.state.thread_msgs);

    	// List of thread messages
        var list = messages.map((thread, index) => {
        			return(
                        	<li className="search-result" key={index}>
                        		<p className="msg">{Object.values(thread)[1]} </p>
                            	<p className="user_date">{Object.values(thread)[0]}, {Object.values(thread)[2]}</p>
                        	</li>
                    	)
                    });
    	if(comments_enabled){
    		return (
    			<div className="discussion">
    				<h2> Discussion: {this.state.thread_name} </h2>
    				<h3 className={this.state.err_msg ? "alert active" : "inactive"}> {this.state.err_msg} </h3>
    				<h4 className={!this.state.msg_len ? "alert active" : "inactive"}> No messages posted yet, be the first.</h4>
    				<ul> {list} </ul>

    			<form id="comment-form" onSubmit={this.postMessage}>
                    <label>Comment</label>
                    <textarea name="description" onChange={(e) => {
                        this.comment = e.target.value;
                    }}/>
                    <input className="btn-secondary" type="submit" value="submit" onChange={this.submitForm}/>
                </form>
    			</div>
    		)
		} else {
			return(
				<div className="discussion">
    				<h2> Discussion: {this.state.thread_name} </h2>
    				<h3 className={this.state.err_msg ? "alert active" : "inactive"}> {this.state.err_msg} </h3>
    				<h4 className={!this.state.msg_len ? "alert active" : "inactive"}> No messages posted yet, be the first.</h4>
    				<ul> {list} </ul>
    				<h3 className="alert"> To comment please login first. </h3>
    			</div>
				)
			}
    	}

}
