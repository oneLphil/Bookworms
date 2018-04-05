class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
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
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: this.username.toLowerCase(),
                    password: this.password,
                    email: this.email
                })
            });
            const data = await response.text();
            this.setState({ msg: data });
            document.getElementById('register-form').reset();
        };

        register().catch(error => {
            this.setState({ msg: 'An error has occured' });
        });
        this.username = '';
        this.password = '';
        this.email = '';
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

    render() {
        return React.createElement(
            'div',
            { className: 'register-container' },
            React.createElement(
                'h2',
                null,
                'Create an Account'
            ),
            React.createElement(
                'div',
                null,
                this.showUserMsg()
            ),
            React.createElement(
                'form',
                { id: 'register-form', onSubmit: this.submitForm },
                React.createElement(
                    'label',
                    null,
                    'Username'
                ),
                React.createElement('input', { type: 'text', name: 'username', onChange: e => {
                        this.username = e.target.value;
                    } }),
                React.createElement(
                    'label',
                    null,
                    'Email'
                ),
                React.createElement('input', { type: 'text', name: 'email', onChange: e => {
                        this.email = e.target.value;
                    } }),
                React.createElement(
                    'label',
                    null,
                    'Password'
                ),
                React.createElement('input', { type: 'password', name: 'password', onChange: e => {
                        this.password = e.target.value;
                    } }),
                React.createElement('input', { className: 'btn-primary', type: 'submit', value: 'Register', onChange: this.handleChange })
            )
        );
    }
}