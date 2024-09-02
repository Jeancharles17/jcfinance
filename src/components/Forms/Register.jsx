import React, { Component } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

class Register extends Component {
    state = {
        email: '',
        password: '',
        displayName: '',
        fireErrors: ''
    }

    register = e => {
        e.preventDefault();

        const auth = getAuth();
        const { email, password, displayName } = this.state;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: displayName
                }).then(() => {
                    // Additional actions after successful registration
                }).catch((error) => {
                    console.log('Error updating profile:', error);
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                this.setState({ fireErrors: errorMessage });
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
                        placeholder="Your Name"
                        value={this.state.displayName} 
                        onChange={this.handleChange}
                        name="displayName"
                    />
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
                    <input className="submitBtn" type="submit" onClick={this.register} value="REGISTER" />
                </form>
            </>
        );
    }
}

export default Register;
  

// import React, { Component } from 'react';
// import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { ref, set } from 'firebase/database';
// import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';
// import { db, storage } from '../Config/Fire'; // Adjust the import path if needed

// class Register extends Component {
//     state = {
//         email: '',
//         password: '',
//         displayName: '',
//         birthDate: '',
//         profilePicture: null,
//         fireErrors: ''
//     }

//     register = e => {
//         e.preventDefault();

//         const auth = getAuth();
//         const { email, password, displayName, birthDate, profilePicture } = this.state;

//         createUserWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 const userId = user.uid;

//                 if (profilePicture) {
//                     const profilePictureRef = storageRef(storage, `profilePictures/${userId}`);
//                     const uploadTask = uploadBytesResumable(profilePictureRef, profilePicture);

//                     uploadTask.on(
//                         'state_changed',
//                         null,
//                         (error) => {
//                             console.error('Upload failed:', error);
//                         },
//                         () => {
//                             getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//                                 this.updateUserProfile(user, displayName, birthDate, url);
//                             });
//                         }
//                     );
//                 } else {
//                     this.updateUserProfile(user, displayName, birthDate);
//                 }
//             })
//             .catch((error) => {
//                 const errorMessage = error.message;
//                 this.setState({ fireErrors: errorMessage });
//             });
//     }

//     updateUserProfile = (user, displayName, birthDate, profilePictureUrl = '') => {
//         updateProfile(user, {
//             displayName: displayName,
//             photoURL: profilePictureUrl
//         }).then(() => {
//             const userRef = ref(db, `Users/${user.uid}`);
//             set(userRef, {
//                 displayName,
//                 birthDate,
//                 profilePictureUrl
//             }).then(() => {
//                 // Handle successful profile update
//             }).catch((error) => {
//                 console.error('Error saving user profile:', error);
//             });
//         }).catch((error) => {
//             console.log('Error updating profile:', error);
//         });
//     }

//     handleChange = e => {
//         const { name, value } = e.target;
//         this.setState({ [name]: value });
//     }

//     handleFileChange = e => {
//         this.setState({ profilePicture: e.target.files[0] });
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
//                     <input type="email"
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
//                     <input
//                         className="regField"
//                         placeholder="Birth Date"
//                         value={this.state.birthDate}
//                         onChange={this.handleChange}
//                         name="birthDate"
//                         type="date"
//                     />
//                     <input
//                         type="file"
//                         className="regField"
//                         onChange={this.handleFileChange}
//                     />
//                     <input className="submitBtn" type="submit" onClick={this.register} value="REGISTER" />
//                 </form>
//             </>
//         );
//     }
// }

// export default Register;
