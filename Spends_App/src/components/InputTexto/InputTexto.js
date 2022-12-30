import React from "react";
import { TouchableOpacity, StyleSheet, TextInput } from "react-native";

import colors from "../../styles/colors";

const InputTexto = (props) =>{
    return (
        <TextInput
            style = {styles.texto}
            placeholder={props.textoPlaceHolder}
            onChangeText={(text) => { props.funcaoOnChangeText(text) } }
        />
    );
};

const styles = StyleSheet.create({
    texto:{  
        width:'100%',
        fontSize:20,
        fontWeight:'bold',
        borderBottomColor:colors.preto_2,
        borderBottomWidth:0.9
    }
            
});


export default InputTexto;