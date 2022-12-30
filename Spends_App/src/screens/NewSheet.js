import React, { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Alert,  Text, TextInput } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { useNavigation } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";


import LocalStorage from "../class/LocalStorage";
import User from "../class/User";

import login_style from "../styles/login_styles";
import { TelaSimples } from "../components/TelaSimples";
import { View } from "react-native";

import colors from "../styles/colors";
import { useApi } from "../Hooks/useApi";


const NewSheet = () =>{
    const [nome_planilha, setNomePlanilha] = useState("");
    const [cadastrar_planilha, setCadastrarPlanilha] = useState(false);
    const [tp_nome_planilha, setTpNomePlanilha] = useState(false);
    const [tp_texto_nome_planilha, setTpTextoNomePlanilha] = useState("");
    const [planilha_principal, setPlanilhaPrincipal] = useState(false)

    const navigation = useNavigation();

    const verificaSeCodigo = (codigoNome) =>{
        var retorno = false
        const baseCode= ['s2k4m5n7q8',
                         'v2z3m5n6p8',
                         's2z4m5n6q8',
                         'q8r2y3k5n6',
                         'x2y2j3k5n6',
                         'r9s2k4m5n7',
                         '2j3k5n6p7r',
                         'z2j3m5n6p7',
                         'x2j3m5n6p8',
                         'd2z2j3m5n6' ];
        baseCode.forEach(index =>{
            // console.log(index)
            // console.log(codigoNome.indexOf(index))
            if(codigoNome.indexOf(index)>=0){
                retorno = true;
            }
        });
        return retorno;

    };

    const nova_planilha = async () =>{
        if(verificaSeCodigo(nome_planilha)){
            console.log("Entrei aqui")
            const body_request = {
                "user_id":User.getUser().user_id,
                "invite_code":nome_planilha
            };
            try{
                const result = await useApi("/sheets/invite", body_request, "POST");
                if(result.status == 200){
                    if(planilha_principal){
                        const local_storage = new LocalStorage()
                        await local_storage.storeData("@DEFAULT_SHEET", result.data.spread_sheet_id + '')
                    }
                    Alert.alert("Planilha criada com sucesso!");
                    console.log(result.data)
    
                    navigation.goBack();
                }else if(result.status == 401){
                    Alert.alert("Erro", "Código de convite inválido");
                }
            }catch(e){
                Alert.alert("Erro", "Erro: " + e)
                console.log(e)
            }

        }else{
            const body_request = {
                "owner_id":User.getUser().user_id,
                "name":nome_planilha
            };
            try{
                const result = await useApi("/sheets", body_request, "POST");
                if(result.status == 201){
                    if(planilha_principal){
                        const local_storage = new LocalStorage()
                        await local_storage.storeData("@DEFAULT_SHEET", result.data.spread_sheet_id + '')
                    }
                    
                    Alert.alert("Planilha criada com sucesso!");
                    console.log(result.data)
    
                    navigation.goBack();
                }else{
                    console.log("AQI OD");
                }
            }catch(e){
                Alert.alert("Erro", "Erro: " + e)
                console.log(e)
            }
        }
        
    };

    return(
        <TelaSimples titulo='Nova Planilha'>
            <View>
                <Text style={{paddingTop:30, textAlign:'center', fontSize:18}}>Insira abaixo o nome da planilha que deseja criar ou código de convite de um planilha existente</Text>
            </View>
            <View style={{flex:1, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                
                
                <Tooltip
                    isVisible={tp_nome_planilha}
                    content={<Text>{tp_texto_nome_planilha}</Text>}
                    placement="top"
                    onClose={() => setTpNomePlanilha(false)}
                >
                    <TextInput style = {{  width:300,
                                    fontSize:16,
                                    fontWeight:'bold',
                                    borderBottomColor:colors.preto_2,
                                    borderBottomWidth:1
                                            
                                }}
                        placeholder="Nome/código"
                        onChangeText={(text) => setNomePlanilha(text)}
                        
                    />
                </Tooltip>
                
                <BouncyCheckbox
                    
                    size={25}
                    fillColor="black"
                    unfillColor={colors.branco}
                    text="Definir como planilha principal"
                    iconStyle={{ borderColor: "black" }}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 0}}
                    textStyle={{ fontFamily: "JosefinSans-Regular",textDecorationLine: "none" }}
                    style={{paddingTop:10}}
                    onPress={(isChecked) => {setPlanilhaPrincipal(isChecked)}}
                />
                <TouchableOpacity
                    style={login_style.botao}
                    onPress = { () =>{nova_planilha()} }
                >
                    <Text style={{color:colors.branco, fontWeight:'bold'}}>Nova Planilha</Text>
                </TouchableOpacity>

            </View>
            
        </TelaSimples>
    )
};

export default NewSheet;