import { StyleSheet} from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import LandingPage from '../screens/LandingPage';
import ProfilePage from '../screens/ProfilePage';
const Drawerbar = () => {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="LandingPage" component={LandingPage} />
            <Drawer.Screen name="ProfilePage" component={ProfilePage} />
        </Drawer.Navigator>
    )
}

export default Drawerbar

const styles = StyleSheet.create({})