import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal,ToastAndroid } from "react-native";
import { TouchableOpacity,  View, Text, StyleSheet } from "react-native";
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import { useApi } from "../../Hooks/useApi";

import colors from "../../styles/colors";

import { BotaoPadrao } from "../BotaoPadrao";
import { InputTexto } from "../InputTexto"; 

const PopupNovaTag = (props)=>{
    const [visible, setVisible] = useState(false);
    const [nova_categoria, setNovaCategoria] = useState("");
    const navigation = useNavigation();


    const salvarCategoria = async () =>{
        try{
            const data = {
                owner_id : props.user_id,
                name : nova_categoria
            }
            const resultado = await useApi('/tags', data, 'POST');
            if(resultado.status == 200){
                props.funcReload();
                ToastAndroid.show('Nova categoria cadastrada com sucesso!', ToastAndroid.LONG);
            }
            
        }catch(e){
            ToastAndroid.show('Erro, tente mais tarde :(', ToastAndroid.LONG);

        }
        setVisible(false);
        
    };

    const deletarCategoria = async (tag_id)=>{
        try{
            
            const resultado = await useApi(`/tags/del?tag_id=${tag_id}`, null, 'GET');
            if(resultado.status == 200){
                props.funcReload();
                ToastAndroid.show('Categoria deletada', ToastAndroid.LONG);
            }
            
        }catch(e){
            ToastAndroid.show('Erro, tente mais tarde :(', ToastAndroid.LONG);

        }
    }

    return(
        <>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={styles.maisTag} onPress={()=>{setVisible(!visible)}}>
                    <IconAntDesign name='plus' size={20}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.maisTag} onPress={()=>{ deletarCategoria(props.tag_id) }}>
                    <IconAntDesign name='delete' size={20}/>
                </TouchableOpacity>
            </View>
            
            <Modal transparent visible={visible} >
                <TouchableOpacity style={{flex:1}} onPress={()=>setVisible(false)}>
                    <View style={styles.popup} >
                        <View style={styles.tituloBox}>
                            <Text style={{fontSize:24, color:colors.preto}}>Nova Categoria</Text>
                        </View>
                        <InputTexto textoPlaceHolder="Nome categoria" funcaoOnChangeText={setNovaCategoria}/>
                        <BotaoPadrao textoBotao="Salvar Categoria" funcaoClick={salvarCategoria} />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    popup:{
        borderRadius:8,
        borderColor:colors.cinza_1,
        borderWidth:1,
        backgroundColor:colors.branco,
        paddingHorizontal:10,
        paddingVertical:10,
        position:'absolute',
        width:'70%',
        top:'40%',
        right:'15%'
    },
    maisTag:{
        borderWidth: 1,
        borderColor: colors.preto_2,
        paddingHorizontal:5,
        paddingVertical:5,
        backgroundColor: colors.branco,
        borderRadius: 100,
        marginBottom:5
    },
    tituloBox:{
        borderBottomColor: colors.cinza_1,
        borderBottomWidth:1,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:30,
        paddingBottom:10
    }

})

export default PopupNovaTag;