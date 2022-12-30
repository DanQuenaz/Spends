import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import colors from "../../styles/colors";

const BotaoPadrao = (props) =>{
    return (
        <TouchableOpacity style={styles.botao} onPress = { () =>{props.funcaoClick()}}>
            <Text style={styles.textoBotao}>{props.textoBotao}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    botao:{
        width:'100%',
        height:42,
        backgroundColor:colors.secundaria,
        marginTop:30,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    textoBotao:{
        fontSize:16,
        fontWeight:'bold',
        color:colors.branco
    }
});

export default BotaoPadrao;