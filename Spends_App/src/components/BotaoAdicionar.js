import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

import colors from "../styles/colors";

const BotaoAdicionar = (props) =>{
    return (
        <TouchableOpacity
            onPress={props.funcao}
            style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 60,
            right: 10,
            height: 70,
            backgroundColor: '#fff',
            borderRadius: 100,
            }}
        >
            <Icon name='plus' size={30} color={colors.primaria} />
        </TouchableOpacity>
    )
};

export default BotaoAdicionar;