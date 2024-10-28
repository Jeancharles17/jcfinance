// import React, { Component } from 'react';
// import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// class Register extends Component {
//     state = {
//         email: '',
//         password: '',
//         displayName: '',
//         fireErrors: ''
//     }

//     register = e => {
//         e.preventDefault();

//         const auth = getAuth();
//         const { email, password, displayName } = this.state;

//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 updateProfile(user, {
//                     displayName: displayName
//                 }).then(() => {
//                     // Additional actions after successful registration
//                 }).catch((error) => {
//                     console.log('Error updating profile:', error);
//                 });
//             })
//             .catch((error) => {
//                 const errorMessage = error.message;
//                 this.setState({ fireErrors: errorMessage });
//             });
//     }

//     handleChange = e => {
//         this.setState({ [e.target.name]: e.target.value });
//     }

//     render() {
//         let errorNotification = this.state.fireErrors ? 
//             (<div className="Error">{this.state.fireErrors}</div>) : null;

//         return (
//             <>
//                 {errorNotification}
//                 <form>
//                     <input type="text"
//                         className="regField"
//                         placeholder="Your Name"
//                         value={this.state.displayName} 
//                         onChange={this.handleChange}
//                         name="displayName"
//                     />
//                     <input type="text"
//                         className="regField"
//                         placeholder="Email"
//                         value={this.state.email} 
//                         onChange={this.handleChange}
//                         name="email"
//                     />
//                     <input
//                         className="regField"
//                         placeholder="Password"
//                         value={this.state.password} 
//                         onChange={this.handleChange}
//                         name="password"
//                         type="password"
//                     />
//                     <input className="submitBtn" type="submit" onClick={this.register} value="REGISTER" />
//                 </form>
//             </>
//         );
//     }
// }

// export default Register;

import React, { Component } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

class Register extends Component {
    state = {
        email: '',
        password: '',
        displayName: '',
        budgetGoal: '', // New state for the budget goal
        budgetAmount: '', // New state for the budget amount
        fireErrors: ''
    }

    register = async e => {
        e.preventDefault();

        const auth = getAuth();
        const { email, password, displayName, budgetGoal, budgetAmount } = this.state;
        const db = getFirestore(); // Initialize Firestore

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with the display name
            await updateProfile(user, { displayName: displayName });

            // Store budget plan details in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: displayName,
                budgetGoal: budgetGoal,
                budgetAmount: budgetAmount,
                email: email
            });

            // Additional actions after successful registration
        } catch (error) {
            console.log('Error during registration:', error.message);
            this.setState({ fireErrors: error.message });
        }
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
                <form onSubmit={this.register}>
                    <input
                        type="text"
                        className="regField"
                        placeholder="Your Name"
                        value={this.state.displayName}
                        onChange={this.handleChange}
                        name="displayName"
                    />
                    <input
                        type="text"
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
                    <input
                        type="text"
                        className="regField"
                        placeholder="What are you saving for?"
                        value={this.state.budgetGoal}
                        onChange={this.handleChange}
                        name="budgetGoal"
                    />
                    <input
                        type="number"
                        className="regField"
                        placeholder="How much do you want to save?"
                        value={this.state.budgetAmount}
                        onChange={this.handleChange}
                        name="budgetAmount"
                    />
                    <input className="submitBtn" type="submit" value="REGISTER" />
                </form>
            </>
        );
    }
}

export default Register;

  


