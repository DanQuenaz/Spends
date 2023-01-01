import {  useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState} from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "react-native";

import { Share } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import User from "../class/User";
import LocalStorage from "../class/LocalStorage";
import BotaoAdicionar from "../components/BotaoAdicionar";
import SemDados from "../components/SemDados";
import { TelaSimples } from "../components/TelaSimples";
import { StyleSheet } from "react-native";
import { formatToReal } from "../functions/number";

import colors from "../styles/colors";
import { useApi } from "../Hooks/useApi";
import PopupNewSheet from "../components/PopUpNewSheet/PopupNewSheet";


const Sheets = () =>{
    const [corpo, setCorpo] = useState(null);
    const local_storage = new LocalStorage();
    const user_id = User.getUser().user_id;

    const route = useRoute();
    const navigation = useNavigation();

    const onShare = async (codigoPlanilha) => {
        try {
          const result = await Share.share({
            message:codigoPlanilha
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

    const deletarPlanilha = async (planilhaId) =>{
        try{
            const body ={
                user_id:user_id,
                spread_sheet_id:planilhaId
            };
            const result = await useApi('/sheets/del', body, 'POST');
            if(result.status == 200){
                Alert.alert("Planilha deleta", "Planilha deletada com sucesso");
                await local_storage.storeData("@DEFAULT_SHEET", 'NONE');
                loadSheets();
            }else if(result.status == 401){
                Alert.alert("Sem permissão", "Você não tem permissão para deletar essa planilha");
            }
        }
        catch(e){
            Alert.alert("Erro", "Ocorreu algum erro ao deletar essa planilha");
        }
    };

    const definirPlanilhaPadrao = async (sheetId) =>{
        const local_storage = new LocalStorage();
        await local_storage.storeData("@DEFAULT_SHEET", sheetId + '');
        navigation.navigate("Home");
    };

    const loadSheets = async () =>{
        try{
            
            const result = await useApi('/sheets?user_id='+user_id, null, 'GET');
            
            if(result.status == 200){
                if(result.data[0]){
                    setCorpo(
                        <ScrollView contentContainerStyle={styles.list}>
                            {result.data.map((item, i)=>(
                                <TouchableOpacity onPress={()=>definirPlanilhaPadrao(item.SPREAD_SHEET_ID)} style={styles.listItem} key={i}>
                                    <View>
                                        <Text style={{fontSize:20, fontWeight:"bold", color:colors.branco}}>{item.NAME}</Text>
                                        <Text style={{fontSize:18, color:colors.branco}}>{formatToReal( item.TOTAL_VALUE == '' ? 0 : item.TOTAL_VALUE )}</Text>
                                        <Text style={{color:colors.branco, paddingTop:10}}>{item.NICKNAME}</Text>
                                    </View>
                                    <View style={{justifyContent:'space-between'}}>
                                        <TouchableOpacity onPress={()=>onShare(item.INVITE_CODE)} >
                                            <Icon name="share-alt" size={18} color={colors.branco}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress = { () =>{
                                                Alert.alert(
                                                    "Está certo disso?",
                                                    "Você tem certeza que deseja deletar esta planilha?",
                                                    [
                                                      // The "Yes" button
                                                      {
                                                        text: "Sim",
                                                        onPress: () => {
                                                            deletarPlanilha(item.SPREAD_SHEET_ID);
                                                        },
                                                      },
                                                      // The "No" button
                                                      // Does nothing but dismiss the dialog when tapped
                                                      {
                                                        text: "Não",
                                                      },
                                                    ]
                                                  );
                                            } }>
                                            <Icon name="trash" size={18} color={colors.branco}/>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                   
                            ))}
                        </ScrollView>
                    );
                }else{
                    setCorpo(<SemDados texto='Sem planilhas cadastradas'/>)
                }
            }
            (result.data);
        }
        catch(e){
            (e);
        }
    };

  

    useFocusEffect(
        React.useCallback(() => {

            loadSheets();
            
            return () => {

                // alert('Screen was unfocused');
                // Useful for cleanup functions

            };
        }, [])
    );

    const novaPlanilha = () =>{
        navigation.navigate("NewSheet");
    }

    return(
        <TelaSimples titulo="Suas Planilhas">
            {corpo}
            <View style={{marginTop:60}}></View>

            <PopupNewSheet funcLoadSheets={loadSheets}/>

        </TelaSimples>
     
    )

   
};

const styles = StyleSheet.create({
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        paddingHorizontal:5,
        justifyContent:'space-between',
        marginBottom:100
    },
    listItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:colors.secundaria,
        width:'48.8%',
        borderColor:colors.cinza_1,
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:10,
        paddingVertical:10,
        margin:2
    }
})

export default Sheets;

