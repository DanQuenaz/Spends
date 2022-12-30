import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal,ToastAndroid } from "react-native";
import { TouchableOpacity,  View, Text, StyleSheet } from "react-native";
import IconAntDesign from 'react-native-vector-icons/AntDesign';


import colors from "../../styles/colors";


const BackCard = (props)=>{

    return(
        <View style={styles.backCard}>
            {props.children}
        </View>
    )
};

const styles = StyleSheet.create({
    backCard:{
        flex:1,
        backgroundColor:colors.secundaria,
        borderRadius:8,
        marginHorizontal:3,
        paddingHorizontal:5,
        paddingVertical:5

    }

})

export default BackCard;