import React, { Component } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import './Login.css'

class Login extends Component {
    state = {
        email: '',
        password: '',
        fireErrors: ''
    }

    login = e => {
        e.preventDefault();

        const auth = getAuth(); // Get the auth instance
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
            .catch((error) => {
                this.setState({ fireErrors: error.message });
            });
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let errorNotification = this.state.fireErrors ? 
            (<div className="Error">{this.state.fireErrors}</div>) : null;

        return (
            <>
                {errorNotification}
                <form>
                    <input type="text"
                        className="regField"
                        placeholder="Email"
                        value={this.state.email} 
                        onChange={this.handleChange}
                        name="email"
                    />
                    <input
                        className="regField"
                        placeholder="Password"
                        value={this.state.password} 
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                    />
                    <input className="submitBtn" type="submit" onClick={this.login} value="ENTER" />
                </form>
            </>
        );
    }
}

export default Login;