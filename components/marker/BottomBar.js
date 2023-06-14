import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from '../screens/LandingPage';
import ProfilePage from '../screens/ProfilePage';
import MessagePage from '../screens/MessagePage';
import MessageListPage from '../screens/MessageListPage';
const BottomBar = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator initialRouteName='LandingPage'
            screenOptions={{
                tabBarActiveTintColor: '#ACE1AF',
                // tabBarStyle:{
                //     height:60, position:'absolute', bottom:20,borderRadius:90, marginHorizontal:25 
                // }
                tabBarLabelStyle: {
                    display: "none"
                },
                headerShown:false
            }}

        >
            <Tab.Screen name="Map" component={LandingPage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <Image
                                source={require('../Images/pin.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#ACE1AF' : "black"
                                }} />
                        </View>
                    )
                }} />
            <Tab.Screen name="Profile" component={ProfilePage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <Image
                                source={require('../Images/user.png')}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: focused ? '#ACE1AF' : 'black'
                                }} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="chat" component={MessageListPage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <Image
                                source={require('../Images/chat.png')}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: focused ? '#ACE1AF' : 'black'
                                }} />
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomBar

const styles = StyleSheet.create({})