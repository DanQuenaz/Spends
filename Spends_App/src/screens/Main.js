import React, {useEffect, useState} from "react";
import { Text, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";



import axios from "axios";
import LocalStorage from "../class/LocalStorage";

import User from "../class/User";

import login_style from "../styles/login_styles";
import colors from "../styles/colors";
import { Image } from "react-native";

const Main = () =>{
    const navigation = useNavigation();
    

    useEffect(()=>{


    //    return ()=> OneSignal.removeEventListener('opened', onOpened);
    }, []);

    useFocusEffect(
        React.useCallback(() => {

            async function fetchData(){
                const localStorage = new LocalStorage()
                const token = await localStorage.getData("@TOKEN");
    
                if(!(token == null)){
                    axios.defaults.headers.common['Authorization'] = `bearer ${token}`

                    const default_sheet_aux = await localStorage.getData("@DEFAULT_SHEET");
                    if(default_sheet_aux && default_sheet_aux !== "NONE" && default_sheet_aux !== ""){
                        User.setDefaultSpreadShet(default_sheet_aux);
                    }

                    navigation.navigate("HomeIndex")
                }else{
                    navigation.navigate("Login")
                }
            };
    
            fetchData();
            
            return () => {

                // alert('Screen was unfocused');
                // Useful for cleanup functions

            };
        }, [])
    );


    return(
        (
            <View style={login_style.container}>
                <Image
                    source={require('../assets/imgs/logo/spends_bg.png')}
                    style={{width:'65%', height:'35%'}}
                />
            </View>
            
      
        )
    )
};

export default Main;