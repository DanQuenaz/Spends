import React, {useEffect, useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import { TouchableOpacity, SafeAreaView, View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import { useApi } from "../../Hooks/useApi";
import { onShare } from "../../functions/shareSheets";



const MembrosPlanilha = (props)=>{
    const [visible, setVisible] = useState(false);
    const [users, setUsers] =  useState([]);
    const [inviteCode, setInviteCode] = useState("");
    const navigation = useNavigation();

    const logOff = async ()=>{

    };

    useEffect(()=>{
        const fetchData = async ()=>{
            const resultMembers = await useApi(`/sheets/get-members?spread_sheet_id=${props.spread_sheet_id}`, null, "GET")
            if(resultMembers.status==200){
                setUsers(resultMembers.data)
            }

            const resultInviteCode = await useApi(`/sheets/get-invite-code?spread_sheet_id=${props.spread_sheet_id}`, null, "GET")
            if(resultMembers.status==200){
                if(resultInviteCode.data[0]) setInviteCode(resultInviteCode.data[0].INVITE_CODE)
            }
        }
        fetchData();
    }, [])

    return(
        <>
            <TouchableOpacity onPress={()=>{setVisible(!visible)}}>
                <IconFeather name="users" size={26} color="#ffffff"/>
            </TouchableOpacity>
            <Modal transparent visible={visible} >
                <TouchableOpacity style={{flex:1}} onPress={()=>setVisible(false)}>
                    <View style={styles.popup} >
                        <View style={styles.popupTop}>
                            <Text style={styles.popupTitle}>Membros Planilha</Text>
                        </View>

                        {users.map((op, i)=>(
                            <View style={[styles.popupItem, {borderBottomWidth: i == users.length - 1 ? 0:1}]} key={i} onPress={op.action}>
                                <Text style={{paddingRight:10, fontSize:18}}>{op.NICKNAME}</Text>
                                <TouchableOpacity><IconFeather name="user-x" size={18}/></TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.popupBottom} onPress={()=>{onShare(inviteCode)}}>
                            <Text style={[styles.popupTitle, {paddingRight:15}]}>Novo membro</Text>
                            <IconFeather name="user-plus" size={20}/>
                        </TouchableOpacity>
                        
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
        position:'absolute',
        top:20,
        right:17
    },
    popupTop:{
        borderBottomWidth:3,
        borderBottomColor: "#CCC",
        marginBottom:10,
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:10

    },
    popupTitle:{
        fontSize:18
    },
    popupBottom:{
        borderTopWidth:2,
        borderTopColor:"#CCC",
        marginTop:10,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:10,
        paddingVertical:8
    },
    popupItem:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:7,
        paddingHorizontal:10,
        borderBottomColor:'#ccc'
    }

})

export default MembrosPlanilha;