import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, ScrollView, } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
const LoginPage = ({ navigation, isPassword }) => {

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errortext, setErrortext] = useState("");
  const [hidepassword, setHidePassword] = useState(true);
  // Login function 
  const handleSubmitPress = async () => {
    setErrortext("");
    if (!userEmail) {
      alert("Please enter your email");
      return;
    }
    if (!userPassword) {
      alert("Please enter your password");
      return;
    }
    auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then(async (user) => {
        console.log(user.user.uid);
        await AsyncStorage.setItem(
          '@yUID',
          (user.user.uid),
        )
        if (user) navigation.replace("LandingPage");
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/invalid-email")
          //setErrortext(error.message);
          setErrortext('That email address is invalid!')
        else if (error.code === "auth/user-not-found")
          setErrortext("No User Found");
        else {
          setErrortext(
            "Please check your email id or password"
          );
        }
      });
  };

  return (
    <ScrollView style={{ backgroundColor: '#F0FFF0', padding: 15, flex: 1 }}>

      <StatusBar backgroundColor="#F0FFF0" barStyle="dark-content" />

      <View style={styles.container}>

        <View style={styles.header}>
          {/* <Text style={styles.text_header}>Sign up</Text> */}
        </View>

        <View style={styles.footer}>

          <View style={styles.action}>
            <Image source={require('../Images/email.png')}
              style={{ height: 18, width: 18, tintColor: '#ACE1AF', top: 4 }}
            />
            <TextInput
              placeholder='Enter Email '
              style={styles.text_input}
              onChangeText={(userEmail) => setUserEmail(userEmail)}
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
              placeholder='Enter Password'
              onChangeText={(userPassword) => setUserPassword(userPassword)}
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

          {errortext != "" ? (
            <Text style={styles.errorTextStyle}>
              {" "}
              {errortext}{" "}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={() => handleSubmitPress()}
            style={styles.signupbtn}
          >
            <Text style={styles.buttonTextStyle}>
              Login
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '400', color: 'black', textAlign: 'center', marginTop: 10 }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("RegisterPage")}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', textAlign: 'center', marginTop: 10 }}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </ScrollView>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  buttonStyle: {
    width: '84%',
    height: 50,
    backgroundColor: '#ACE1AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop: 30
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#026efd',
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
    flex: 2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50

  }, container: {
    flex: 1,
    // backgroundColor: '#ACE1AF',
    backgroundColor: '#F0FFF0'

  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 50,

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
    paddingBottom: 5,
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
    width: '100%',
    height: 50,
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
})