import { StyleSheet, View, Image, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashPage = ({ navigation }) => {
    useEffect(() => {
        funcNavigate()
    }, [1])
    const funcNavigate = async () => {
        // setTimeout(() => {
        //     // navigation.reset({
        //     //     index: 0,
        //     //     routes: [{ name: "LoginPage" }],
        //     //   });
        //      navigation.navigate("LoginPage")
        // }, 3000);
        const userid = await AsyncStorage.getItem('@yUID')
        console.log("id", userid);
        setTimeout(() => {
            if (userid != null) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LandingPage" }]
                })
            }
            else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginPage" }]

                })
            }
        }, 2000);
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#F0FFF0" barStyle="dark-content" />
            <Image
                resizeMode={"contain"} // or cover
                style={{ height: 150, width: 150, borderRadius: 100 }}
                source={require('../Images/images.jpeg')}
            />
        </View>
    )
}
export default SplashPage
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFF0',
        alignItems: 'center',
        justifyContent: 'center',
    }
})