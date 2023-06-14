
import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashPage from '../screens/SplashPage';
import LandingPage from '../screens/LandingPage';
import LoginPage from '../screens/LoginPage'
import RegisterPage from '../screens/RegisterPage';
import ProfilePage from '../screens/ProfilePage';
import UpdatePage from '../screens/UpdatePage';
import BottomBar from '../marker/BottomBar';
import MessagePage from '../screens/MessagePage';
import ChatPage from '../screens/ChatPage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Stack = createNativeStackNavigator();
const Route = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const userCheck = auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        console.log("userExist", user)
        firestore()
          .collection('users').
          doc(userExist.uid)
          .update({
            status: 'online'
          })
        setUser(userExist)
      }
      else setUser("")
      console.log(user);
    })
    return () => {
      userCheck()
    }
  }, [])
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SplashPage' component={SplashPage} />
      {/* {user ?
        <Stack.Screen name='LandingPage' component={BottomBar}
          screenOptions={{ headerShown: false }} /> :
        <>
          <Stack.Screen name='LoginPage' component={LoginPage} />
          <Stack.Screen name='RegisterPage' component={RegisterPage} />
        </>
      } */}
      <Stack.Screen name='LoginPage' component={LoginPage} />
      <Stack.Screen name='RegisterPage' component={RegisterPage} />
      <Stack.Screen name='LandingPage' component={BottomBar}
        screenOptions={{ headerShown: false }} />
      <Stack.Screen name='ProfilePage' component={ProfilePage} />
      <Stack.Screen name='UpdatePage' component={UpdatePage} />
      <Stack.Screen name='MessagePage' component={MessagePage}
        options={{ headerShown: false }} />
      <Stack.Screen name='ChatPage' component={ChatPage} />
    </Stack.Navigator>
  )
}

export default Route