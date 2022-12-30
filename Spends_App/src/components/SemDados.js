import React from "react";
import { Text, View } from "react-native";

const SemDados = (props) =>{
    return (
        <View style={{flex:1, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <Text style={{fontSize:24}}>{props.texto}</Text>
        </View>
    )
};

export default SemDados;