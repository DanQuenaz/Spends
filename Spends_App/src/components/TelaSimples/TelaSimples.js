import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";

import login_style from "../../styles/login_styles";
import home_styles from "../../styles/home_styles";
import PopupMenu from "../PopupMenu";
import { TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import colors from "../../styles/colors";

const TelaSimples = (props) =>{
    const navigation = useNavigation()
    return (
        <View style={login_style.container_withe}>
            <LinearGradient start={{x:0.15,y:0.4}} end={{x:0.7,y:1.0}} location={[1,1]} colors={[colors.primaria, colors.secundaria]} 
                style={{
                    flex:1,
                    flexDirection:'row',
                    backgroundColor:'#ff5500',
                    width:'100%',
                    alignContent:'center',
                    alignItems:'center',
                    justifyContent:'space-between',
                    paddingHorizontal:10
                }}
            >
                <TouchableOpacity>
                    <Icon name='angle-left' size={30} color="#fff" onPress={()=>{navigation.goBack()}}/>
                </TouchableOpacity>
                <Text style={{color:'#ffffff', fontSize:24, marginTop:10}}>
                    {props.titulo}
                </Text>
                <PopupMenu/>
            </LinearGradient>

            <View style={home_styles.container_under}>
                {props.children}
            </View>
        </View>
    )
};

export default TelaSimples;