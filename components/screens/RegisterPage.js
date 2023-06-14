
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native'
import React, { useState, } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
const RegisterPage = ({ navigation }) => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [confirmPass, setconfirmPass] = useState('');
    const [errortext, setErrortext] = useState("");
    const [hidepassword, setHidePassword] = useState(true);
    const [conHidepassword, setConHidePassword] = useState(true);
    const [image, setImage] = useState(null)

    // Registered function logic 
    const registerUser = async (email, password, firstName, confirmPass,) => {
        setErrortext("");
        if (!firstName) {
            alert("Please enter your name");
            return;
        }
        if (!email) {
            alert("Please enter your email");
            return;
        }
        if (!password) {
            alert("Please enter your password");
            return;
        }
        if (!confirmPass) {
            alert("Please enter your confirm password");
            return;
        }
        if (password != confirmPass) {
            alert("Confirm password doesn't match ");
        }
        else {
            try {
                const newReg = await auth().createUserWithEmailAndPassword(email, password)
                console.log("newReg", newReg)
                firestore().collection('users').doc(newReg.user.uid).set({
                    name: firstName,
                    email: newReg.user.email,
                    uid: newReg.user.uid,
                    image: '',
                    status: 'online'
                })
                alert('Registration successful! added user ');
                navigation.navigate("LoginPage")
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    setErrortext("That email address is already in use!")

                }
                if (err.code === 'auth/invalid-email') {
                    setErrortext("That email address is invalid!")
                }
            }
        }
    }
    
    // const pickImageAndUpload = async () => {
    //     launchImageLibrary({ quality: 0.5 }, (fileobj) => {
    //         console.log("fileobj", fileobj)
    //         if (fileobj.errorCode || fileobj.didCancel) {
    //             return console.log('You should handle errors or user cancellation!');
    //         }
    //         const img = fileobj.assets[0];
    //         const uploadTask = storage()
    //             .ref()
    //             .child(`/userprofile/${Date.now()}`)
    //             .putFile(img.uri)
    //         console.log("uploadTask", uploadTask)
    //         uploadTask.on('state_changed',
    //             (snapshot) => {
    //                 var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log("progress", progress)
    //                 if (progress == 100) alert('image uploaded')
    //             },
    //             (error) => {
    //                 alert("error uploading image")
    //             },
    //             () => {
    //                 uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //                     setImage(downloadURL)
    //                 });
    //             }
    //         );
    //     })
    // }

    return (
        <ScrollView style={{ backgroundColor: '#F0FFF0', padding: 15, flex: 1 }}>
            <StatusBar backgroundColor="#F0FFF0" barStyle="dark-content" />
            {/* <View style={styles.box1}>
                <Text style={styles.text}>Welcome to Whatsapp 5.0</Text>
                <TouchableOpacity onPress={() => pickImageAndUpload()}>
                    <Image style={styles.img}
                        source={image !== '' ? require('../Images/user.png') : { uri: image }}
                    />
                </TouchableOpacity>
            </View> */}
            <View
                style={styles.container}
            >
                <View style={styles.header}>
                    {/* <Text style={styles.text_header}>Sign up</Text> */}
                </View>

                <View style={styles.footer}>

                    <View style={styles.action}>
                        <Image source={require('../Images/user.png')}
                            style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                        />
                        <TextInput
                            style={styles.text_input}
                            placeholder=" Enter name"
                            onChangeText={(firstName) => setFirstName(firstName)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={'#ACE1AF'}
                        />
                    </View>

                    <View style={styles.action}>

                        <Image source={require('../Images/email.png')}
                            style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                        />
                        <TextInput
                            style={styles.text_input}
                            placeholder="Enter email"
                            onChangeText={(email) => setEmail(email)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor={'#ACE1AF'}
                        />
                    </View>
                    <View style={styles.action}>
                        <Image source={require('../Images/keyji.png')}
                            style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                        />
                        <TextInput
                            style={styles.text_input}
                            placeholder=" Enter password"
                            onChangeText={(password) => setPassword(password)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={hidepassword}
                            placeholderTextColor={'#ACE1AF'}
                        />
                        <TouchableOpacity style={styles.loginEyeCrossiconStyle}
                            onPress={() => setHidePassword(!hidepassword)}>
                            {hidepassword ?
                                <Image source={require('../Images/hidden.png')}
                                    style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                                />
                                :
                                <Image source={require('../Images/view.png')}
                                    style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.action}>
                        <Image source={require('../Images/keyji.png')}
                            style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                        />
                        <TextInput
                            style={styles.text_input}
                            placeholder=" Enter confirm password"
                            onChangeText={(confirmPass) => setconfirmPass(confirmPass)}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={conHidepassword}
                            placeholderTextColor={'#ACE1AF'}
                        />
                        <TouchableOpacity style={styles.loginEyeCrossiconStyle}
                            onPress={() => setConHidePassword(!conHidepassword)}>
                            {conHidepassword ?
                                <Image source={require('../Images/hidden.png')}
                                    style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                                />
                                :
                                <Image source={require('../Images/view.png')}
                                    style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {errortext != "" ? (
                        <Text style={styles.errorTextStyle}>
                            {" "}
                            {errortext}{" "}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        onPress={() =>
                            registerUser(email, password, firstName, confirmPass)
                        }
                        style={styles.signupbtn}
                    >
                        <Text style={styles.buttonTextStyle}>
                            Sign up
                        </Text>

                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '400', color: 'black', textAlign: 'center', marginTop: 10 }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
                            <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', textAlign: 'center', marginTop: 10 }}> Login</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </ScrollView>
    )
}

export default RegisterPage

const styles = StyleSheet.create({
    button: {
        marginTop: 50,
        height: 70,
        width: 250,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },

    buttonTextStyle: {
        color: "#FFFFFF",
        paddingVertical: 10,
        fontSize: 16,
    },
    signupbtn: {
        width: '100%',
        height: 50,
        backgroundColor: '#ACE1AF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        alignContent: 'center',
        marginTop: 30
    },
    errorTextStyle: {
        color: "red",
        textAlign: "center",
        fontSize: 14,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50

    }, container: {
        flex: 1,
        backgroundColor: '#F0FFF0',
    },
    footer: {
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 50
    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ACE1AF',
        //paddingBottom: 5,
    },
    text_input: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 10,
        color: '#ACE1AF'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signin: {
        width: '100%', height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textsign: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    loginEyeCrossiconStyle: {
        flexDirection: "row",
        // width: 70,
        right: 5,
    },
    text: {
        fontSize: 22,
        color: "green",
        margin: 10
    },
    img: {
        width: 80,
        height: 80
    },
    box1: {
        alignItems: "center"
    },
    box2: {
        paddingHorizontal: 40,
        justifyContent: "space-evenly",
        height: "50%"
    }
})