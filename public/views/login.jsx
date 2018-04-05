class LoginResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg : ''
        }
        this.login = '';
        this.password = '';
        this.submitForm = this.submitForm.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.showUserMsg = this.showUserMsg.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        const register = async () => {
            const response = await fetch('/login', {
                method : 'post',
                headers: {'Content-Type' : 'application/json'},
                credentials : 'include',
                body : JSON.stringify({
                    username : this.login.toLowerCase().trim(),
                    password : this.password
                })
            });

            const data = await response.text();
            this.setState({msg : data});
            document.getElementById('login-form').reset();

            if(this.state.msg == 'Logged in successfully'){
                this.props.setLoggedInUserFunc(this.login.toLowerCase().trim());
                this.props.changeViewFunc("profile",
                    {currentUser : this.login.toLowerCase().trim()});
            }
            this.login = '';
            this.password = '';
        };

        register().catch((error) => {
            this.setState({msg : 'An error has occured'});
            this.login = '';
            this.password = '';
        });
    }

    showUserMsg() {
        if (this.state.msg != '')
            return (<div id="register-status">{this.state.msg}<br/><br/></div>);

        else return (<div id="register-status"></div>);
    }

    buttonClicked(e) {
        e.preventDefault();
        let buttonId = e.target.id;

        if (buttonId == "register-button") {
            this.props.changeViewFunc("register", {});
        }
    }

    render(){

        return (
            <div className="login-container">
                <h2>Login</h2>
                <div>{this.showUserMsg()}</div>
                <form id="login-form" onSubmit={this.submitForm}>
                    <label>Username</label>
                    <input type="text" name="username" onChange={(e) => {
                        this.login = e.target.value;
                    }}/>

                    <label>Password</label>
                    <input type="password" name="password" onChange={(e) => {
                        this.password = e.target.value;
                    }}/>
                    <input className="btn-primary" type="submit" id="loginForm"
                    value="Log In" onChange={this.handleChange} />
                </form>


                <p className="alert-register">
                <a href="" id="register-button" onClick={this.buttonClicked}>Haven't registered yet? <br/>
                What you waiting for!</a></p>
            </div>
        );
    }

}
