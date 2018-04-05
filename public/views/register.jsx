class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg : ''
        };
        this.username = '';
        this.password = '';
        this.email = '';
        this.submitForm = this.submitForm.bind(this);
        this.showUserMsg = this.showUserMsg.bind(this);
    }

    submitForm(e) {
        e.preventDefault();
        const register = async () => {
            const response = await fetch('/register', {
                method : 'post',
                headers: {'Content-Type' : 'application/json'},
                credentials : 'include',
                body : JSON.stringify({
                    username : this.username.toLowerCase(),
                    password : this.password,
                    email : this.email
                })
            });
            const data = await response.text();
            this.setState({msg : data});
            document.getElementById('register-form').reset();
        };

        register().catch((error) => {
            this.setState({msg : 'An error has occured'});
        });
        this.username = '';
        this.password = '';
        this.email = '';
    }

    showUserMsg() {
        if (this.state.msg != '')
            return (<div id="register-status">{this.state.msg}<br/><br/></div>);

        else return (<div id="register-status"></div>);
    }

    render() {
        return (
            <div className="register-container">

                <h2>Create an Account</h2>

                <div>{this.showUserMsg()}</div>

                <form id="register-form" onSubmit={this.submitForm}>
                    <label>Username</label>
                    <input type="text" name="username" onChange={(e) => {
                        this.username = e.target.value;
                    }}/>

                    <label>Email</label>
                    <input type="text" name="email" onChange={(e) => {
                        this.email = e.target.value;
                    }}/>

                    <label>Password</label>
                    <input type="password" name="password" onChange={(e) => {
                        this.password = e.target.value;
                    }}/>

                    <input className="btn-primary" type="submit" value="Register" onChange={this.handleChange}/>
                </form>
            </div>
        );
    }
}
