import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import { TouchableOpacity, SafeAreaView, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import LocalStorage from "../class/LocalStorage";

import colors from "../styles/colors";

const PopupMenu = ()=>{
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const logOff = async ()=>{
        try{
            console.log("entrei aqui")
            const localStorage = new LocalStorage()
            await localStorage.removeData("@TOKEN");
            await localStorage.removeData("@USER_DATA");
            await localStorage.removeData("@DEFAULT_SHEET");
            navigation.navigate("Main")
        }catch(e){
            console.log(e)
        }
    };

    const options = [
        {
            icon: 'gear',
            titulo: 'Configurações',
            action: ()=>{setVisible(false)}
        },
        {
            icon: 'info',
            titulo: 'Sobre',
            action: ()=>{setVisible(false)}
        },
        {
            icon: 'sign-out',
            titulo: 'Sair',
            action: ()=>{
                logOff();
                setVisible(false);
            }
        }
        
    ];

    return(
        <>
            <TouchableOpacity onPress={()=>{setVisible(!visible)}}>
                <IconIonicons name="ellipsis-vertical-circle" size={26} color="#ffffff"/>
            </TouchableOpacity>
            <Modal transparent visible={visible} >
                <TouchableOpacity style={{flex:1}} onPress={()=>setVisible(false)}>
                    <View style={styles.popup} >
                        {options.map((op, i)=>(
                            <TouchableOpacity style={[styles.popupItem, {borderBottomWidth: i == options.length - 1 ? 0:1}]} key={i} onPress={op.action}>
                                <Text style={{paddingRight:10, fontSize:18}}>{op.titulo}</Text>
                                <Icon name={op.icon} size={18}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    popup:{
        borderRadius:8,
        borderColor:'#333',
        borderWidth:1,
        backgroundColor:'#fff',
        paddingHorizontal:10,
        position:'absolute',
        top:20,
        right:17
    },
    popupItem:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:7,
        borderBottomColor:'#ccc'
    }
})

export default PopupMenu;