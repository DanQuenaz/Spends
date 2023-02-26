import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { Modal,Switch,ToastAndroid } from "react-native";
import { TouchableOpacity,  View, Text, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import { useApi } from "../../Hooks/useApi";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

import colors from "../../styles/colors";

import { BotaoPadrao } from "../BotaoPadrao";
import { TextInput } from "react-native";

import User from "../../class/User";
import { useEffect } from "react";

const PopupNewSheet = (props)=>{
    const [visible, setVisible] = useState(false);
    const [nome_planilha, setNomePlanilha] = useState("");
    const [texto_campo, setTextoCampo] = useState("Nome planilha");
    const [tp_nome_planilha, setTpNomePlanilha] = useState(false);
    const [tp_texto_nome_planilha, setTpTextoNomePlanilha] = useState("");
    const [planilha_principal, setPlanilhaPrincipal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        setTextoCampo(isEnabled ? "Nome planilha"  : "Código convite");
        
    };

    const toggleSwitchValue = (value)=>{
        setIsEnabled(value);
        setTextoCampo(!value ? "Nome planilha"  : "Código convite");
    };

    const navigation = useNavigation();
    const localStorage = useLocalStorage();
    

    const nova_planilha = async () =>{
        setIsLoading(true)
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
                // (index)
                // (codigoNome.indexOf(index))
                if(codigoNome.indexOf(index)>=0){
                    retorno = true;
                }
            });
            return retorno;
    
        };

        if(isEnabled){
            ("Entrei aqui")
            const body_request = {
                "user_id":User.getUser().user_id,
                "invite_code":nome_planilha
            };
            try{
                const result = await useApi("/sheets/invite", body_request, "POST");
                if(result.status == 200){
                    if(planilha_principal){
                        await localStorage.storeData("@DEFAULT_SHEET", result.data.spread_sheet_id + '')
                    }
                    ToastAndroid.show("Planilha criada com sucesso!", ToastAndroid.LONG);
                    (result.data)
                    
                    if(planilha_principal) navigation.goBack();
                    
                }else if(result.status == 401){
                    ToastAndroid.show("Código de convite inválido", ToastAndroid.LONG);
                }
            }catch(e){
                ToastAndroid.show("Erro: " + e, ToastAndroid.LONG)
                (e)
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
                        await localStorage.storeData("@DEFAULT_SHEET", result.data.spread_sheet_id + '')
                    }
                    
                    ToastAndroid.show("Planilha criada com sucesso!", ToastAndroid.LONG);
                    (result.data)
    
                    if(planilha_principal) navigation.goBack();
                }else{
                    ("AQI OD");
                }
            }catch(e){
                ToastAndroid.show("Erro: " + e, ToastAndroid.LONG)
                (e)
            }
        };
        setIsLoading(false)
        setVisible(false);
        props.funcLoadSheets();

        
    };

    useEffect(()=>{
        setPlanilhaPrincipal(false);
    },[]);

    return(
        <>
            <TouchableOpacity
                onPress={()=>{setVisible(!visible)}}
                style={{
                borderWidth: 1,
                borderColor: colors.preto_2,
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                position: 'absolute',
                bottom: 60,
                right: 10,
                height: 70,
                backgroundColor: colors.branco,
                borderRadius: 100,
                }}
            >
                <IconAntDesign name='plus' size={30} color={colors.primaria} />
            </TouchableOpacity>
            
            <Modal transparent visible={visible} >
                <TouchableOpacity style={{flex:1}} onPress={()=>setVisible(false)}>
                    <View style={styles.popup} >
                        <View style={styles.tituloBox}>
                            <Text style={{fontSize:24, color:colors.branco}}>Nova Planilha</Text>
                        </View>
                        {/* <InputTexto textoPlaceHolder="Nome planilha/código convite" funcaoOnChangeText={setNovaCategoria}/> */}
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:5}}>
                            <TouchableOpacity onPress={()=>toggleSwitchValue(false)}>
                                <Text style={{color:colors.branco, fontWeight:!isEnabled?'bold':'normal'}}>Nova Planilha</Text>
                            </TouchableOpacity>
                            <Switch
                                trackColor={{ false: colors.terciaria, true: colors.terciaria }}
                                thumbColor={colors.secundaria}
                                ios_backgroundColor={colors.secundaria}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <TouchableOpacity onPress={()=>toggleSwitchValue(true)}>
                                <Text style={{color:colors.branco, fontWeight:isEnabled?'bold':'normal'}}>Planilha Existente</Text>
                            </TouchableOpacity>
                            

                        </View>
                        
                        <TextInput placeholder={texto_campo} style={styles.input} onChangeText={(text)=>{setNomePlanilha(text)}}/>
                        <BouncyCheckbox
                                size={25}
                                fillColor={colors.secundaria}
                                text="Definir como planilha principal"
                                unfillColor={colors.branco}
                                iconStyle={{ borderColor: "black" }}
                                innerIconStyle={{ borderWidth: 0, borderRadius: 0}}
                                textStyle={{ fontFamily: "JosefinSans-Regular", color:colors.branco, textDecorationLine: "none" }}
                                style={{paddingTop:20}}
                                onPress={(isChecked) => {setPlanilhaPrincipal(isChecked)}}
                            />
                        <BotaoPadrao textoBotao="Criar Planilha" funcaoClick={nova_planilha} disabled={isLoading}/>
                        
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    popup:{
        borderRadius:8,
        backgroundColor:colors.primaria,
        paddingHorizontal:10,
        paddingVertical:10,
        position:'absolute',
        width:'80%',
        top:'40%',
        right:'10%'
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
        paddingBottom:10,
        
    },
    input:{
        backgroundColor:colors.branco,
        borderRadius:8,
        fontSize:22
    }

})

export default PopupNewSheet;