import React, { Component } from 'react';
import Register from '../Forms/Register';
import { auth } from '../Config/Fire';
import Login from '../Forms/Login';
import Tracker from '../Tracker/Tracker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faXTwitter, faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import './Main.css';

export default class Main extends Component {
    state = {
        user: null,
        loading: true,
        formSwitcher: false
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        auth.onAuthStateChanged((user) => {
            console.log('User:', user); 
            if (user) {
                this.setState({ user, loading: false });
            } else {
                this.setState({ user: null, loading: false });
            }
        });
    }

    formSwitcher = (action) => {
        this.setState({ formSwitcher: action === 'register' ? true : false });
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        }

        const form = this.state.formSwitcher ? <Login /> : <Register />;

        return (
            <div className="mainBlock">
                <h1>AI Power Budget</h1>
                {!this.state.user ? (
                    <>
                        {form}
                        {!this.state.formSwitcher ? (
                            <span className="underLine">
                                Already have an account?{' '}
                                <button onClick={() => this.formSwitcher('register')} className="linkBtn">
                                    Login
                                </button>
                            </span>
                        ) : (
                            <span className="underLine">
                                Don't have an account{' '}
                                <button onClick={() => this.formSwitcher('login')} className="linkBtn">
                                    Sign Up
                                </button>
                            </span>
                        )}
                    </>
                ) : (
                    <Tracker />
                )}
                <div className="footer">
                    <div className="downloadSection">
                        <p>Download our app:</p>
                        <a href="#">
                            <FontAwesomeIcon icon={faApple} size="2x" />
                        </a>
                        <a href="#">
                            <FontAwesomeIcon icon={faGooglePlay} size="2x" />
                        </a>
                    </div>
                    <div className="socialMedia">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} size="2x" />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faXTwitter} size="2x" />
                        </a>
                    </div>
                    <div className="copyright">
                        &copy; 2024 JC Financial. All rights reserved.
                    </div>
                </div>


            </div>
        );
    }
}


