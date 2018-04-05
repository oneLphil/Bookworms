class LoginResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        };
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
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: this.login.toLowerCase().trim(),
                    password: this.password
                })
            });

            const data = await response.text();
            this.setState({ msg: data });
            document.getElementById('login-form').reset();

            if (this.state.msg == 'Logged in successfully') {
                this.props.setLoggedInUserFunc(this.login.toLowerCase().trim());
                this.props.changeViewFunc("profile", { currentUser: this.login.toLowerCase().trim() });
            }
            this.login = '';
            this.password = '';
        };

        register().catch(error => {
            this.setState({ msg: 'An error has occured' });
            this.login = '';
            this.password = '';
        });
    }

    showUserMsg() {
        if (this.state.msg != '') return React.createElement(
            'div',
            { id: 'register-status' },
            this.state.msg,
            React.createElement('br', null),
            React.createElement('br', null)
        );else return React.createElement('div', { id: 'register-status' });
    }

    buttonClicked(e) {
        e.preventDefault();
        let buttonId = e.target.id;

        if (buttonId == "register-button") {
            this.props.changeViewFunc("register", {});
        }
    }

    render() {

        return React.createElement(
            'div',
            { className: 'login-container' },
            React.createElement(
                'h2',
                null,
                'Login'
            ),
            React.createElement(
                'div',
                null,
                this.showUserMsg()
            ),
            React.createElement(
                'form',
                { id: 'login-form', onSubmit: this.submitForm },
                React.createElement(
                    'label',
                    null,
                    'Username'
                ),
                React.createElement('input', { type: 'text', name: 'username', onChange: e => {
                        this.login = e.target.value;
                    } }),
                React.createElement(
                    'label',
                    null,
                    'Password'
                ),
                React.createElement('input', { type: 'password', name: 'password', onChange: e => {
                        this.password = e.target.value;
                    } }),
                React.createElement('input', { className: 'btn-primary', type: 'submit', id: 'loginForm',
                    value: 'Log In', onChange: this.handleChange })
            ),
            React.createElement(
                'p',
                { className: 'alert-register' },
                React.createElement(
                    'a',
                    { href: '', id: 'register-button', onClick: this.buttonClicked },
                    'Haven\'t registered yet? ',
                    React.createElement('br', null),
                    'What you waiting for!'
                )
            )
        );
    }

}