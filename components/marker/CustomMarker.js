import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

const CustomMarker = ({item}) => {
  return (
    <View style={styles.roundMarker}>
    <Image style={styles.roundImage}
        source={{uri:item.markerImage}}
    />
    </View>
  )
}

export default CustomMarker

const styles = StyleSheet.create({
    roundMarker:{
        height:50, 
        width:50,
        backgroundColor:'white', 
        borderRadius:25
    },
    roundImage:{
        height:50,
        width:50,
        borderRadius:25
    }
})