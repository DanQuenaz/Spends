import React, {useRef} from "react";
import { Text, SafeAreaView, TouchableOpacity, Alert, View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import { useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import OneSignal from "react-native-onesignal";

import moment from "moment/moment";
import 'moment/locale/pt-br';


import LocalStorage from "../class/LocalStorage";
import User from "../class/User"
import { formatToReal } from "../functions/number";
import { useApi } from "../Hooks/useApi";

import home_style from "../styles/home_styles";
import BotaoAdicionar from "../components/BotaoAdicionar";
import SemDados from "../components/SemDados";
import PopupMenu from "../components/PopupMenu";

import colors from "../styles/colors";
import { ToastAndroid } from "react-native";
import Swipeable from "react-native-gesture-handler";
import { MonthSelector } from "../components/MonthSelector";
import { MembrosPlanilha } from "../components/MembrosPlanilha";




const Home = () =>{
    moment.locale('pt-br');
    const ONESIGNAL_APP_ID = 'f68d22b5-f3a3-49ec-9d43-472418527c9b'

    const [mes_ano_selecionado, setMesSelecionado] = useState({
        mes: parseInt(moment().subtract(0, "month").format('MM')),
        ano: parseInt(moment().subtract(0, "year").format('YYYY'))
    });
    
    const [corpo, setCorpo] = useState(null);
    const [user_id, setUserId] = useState(null);
    const [nickname, setNickName] = useState("");
    const [default_sheet, setDefaultSheet] = useState(0);
    const [tags, setTags] = useState([]);
    const [spend_editing, setSpendEditing] = useState(false);
    
    const [total_gastos, setTotalGastos] = useState("...");

    const navigation = useNavigation();
    const localStorage = new LocalStorage();

    const atualizaFiltroMeses = useRef();

    const calculaTotalGastos = (data) =>{
        var total_aux = 0;
        data.forEach(function (item, index) {
            total_aux += item.VALUE;
        });
        return total_aux;
    };

    const closeSpends = async () =>{
        try{
            const result = await useApi(`/sheets/close?spread_sheet_id=${default_sheet}`, null, 'GET');
            if(result.status==200){
                loadSpends()
            }else{
                Alert.alert("Erro", "Erro ao fechar planilha, tente mais tarde...")
            }

        }catch(e){
            Alert.alert("Erro", "Erro ao fechar planilha, tente mais tarde...")

        }
    }

    const deletarDespesa = async (spendId, ownerId)=>{
        if(ownerId == User.getUser().user_id){
            try{
                const result = await useApi(`/spends/del?spend_id=${spendId}`, null, 'GET');
                if(result.status == 200){
                    loadSpends();
                    ToastAndroid.show("Despesa deletada com sucesso!", ToastAndroid.SHORT);
                }
            }catch(e){
                ToastAndroid.show("Erro ao deletar despesa, tente mais tarde.", ToastAndroid.LONG);
            }
        }else{
            ToastAndroid.show("Você não tem permissão para deletar essa despesa.", ToastAndroid.LONG);
        }
    };

    const loadSpends = async () =>{
        
        try{
            atualizaFiltroMeses.current.geraMeses();
            const default_sheet_aux = await localStorage.getData("@DEFAULT_SHEET");
            if(default_sheet_aux && default_sheet_aux !== "NONE" && default_sheet_aux !== ""){
                setDefaultSheet(default_sheet_aux);
                User.setDefaultSpreadShet(default_sheet_aux);
                const body_request = {
                    "spread_sheet_id": parseInt(default_sheet_aux)
                };
                const result = await useApi(`/spends?spread_sheet_id=${default_sheet_aux}&month=${mes_ano_selecionado.mes}&year=${mes_ano_selecionado.ano}`, body_request, "GET");
                if(result.status == 200){
                    setTotalGastos(formatToReal(calculaTotalGastos( result.data) ));
                    if(result.data[0]){
                        setCorpo((
                            <FlatList
                                style={{marginBottom:50, marginTop:10, marginLeft:5, marginRight:5}}
                                keyExtractor={(item)=>item.SPEND_ID}
                                data={result.data}
                                renderItem={({item})=>(
                                    
                                    <View style={styles.itemLista} >
                                        <View style={{flex:8, flexDirection:'row', justifyContent:'space-between', paddingRight:10}}>
                                            <View style={{flexDirection:'column',justifyContent:'space-between'}} >
                                                    <Text style={{fontFamily:'Roboto-Medium',color:colors.cinza_1,fontSize:20}} >{item.DESCRIPTION + item.INSTALLMENT_DESCRIPTION}</Text>
                                                    <Text>{item.NICKNAME}</Text>
                                                    <Text style={{fontFamily:'Roboto-Bold',fontSize:12}} >{moment(item.DATE).format("DD MMM HH:mm")}</Text>
                                            </View>
                                            <View style={{flexDirection:'column', justifyContent:'center'}} >
                                                <Text style={{fontFamily:'Roboto-Medium',fontSize:24,color:colors.cinza_2}} >{formatToReal(item.VALUE)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:1, flexDirection:'column', borderLeftColor:colors.cinza_1, borderLeftWidth:1, alignItems:'flex-end', justifyContent:'space-between'}} >
                                            <TouchableOpacity onPress={()=>{
                                                navigation.navigate("NewSpend", {spend_id:item.SPEND_ID, valor_total:item.TOTAL_VALUE, valor:item.VALUE, descricao:item.DESCRIPTION, tag:item.TAG_ID, fixado:item.FIXED==1, data: item.INITIAL_DATE, parcelas: item.TOTAL_INSTALLMENTS, atualizaDespesa:true})
                                            }}>
                                                <Icon name='edit' size={18}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{
                                                Alert.alert(
                                                    "Está certo disso?",
                                                    "Você tem certeza que deseja deletar esta depesa?",
                                                    [
                                                      // The "Yes" button
                                                      {
                                                        text: "Sim",
                                                        onPress: () => {
                                                            deletarDespesa(item.SPEND_ID, item.OWNER_ID);
                                                        },
                                                      },
                                                      // The "No" button
                                                      // Does nothing but dismiss the dialog when tapped
                                                      {
                                                        text: "Não",
                                                      },
                                                    ]
                                                  );
                                            }}>
                                                <Icon name='trash' size={18}/>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                )}
                            />
                        ));
                    }else{
                        setCorpo((
                            <SemDados texto='Sem gastos cadastrados'/>
                        ))
                    }
                }
            }else{
                setTotalGastos(formatToReal(0));
                setCorpo((
                            
                    <View style={home_style.container_sem_planilhas}>
                        <Text style={{fontFamily:'Roboto-Medium',fontSize:20}}>Selecione uma planilha para exibis os gastos</Text>
                        <TouchableOpacity 
                            style={home_style.botao}
                            onPress = { cadastrar_planilha }
                        >
                            <Text style={home_style.textoBotao}>Selecionar planilha</Text>
                        </TouchableOpacity>
                    </View>
                ))
            }
            
        }catch(e){
            (e)
            return e
        }
    };

    useEffect(() => {

        async function fetchData2() {
            const user_data = await localStorage.getData("@USER_DATA");
            const user_data_aux =  JSON.parse(user_data);
            
            User.setUser(user_data_aux);
            
            setUserId(user_data_aux.user_id);
            setNickName(user_data_aux.nickname);

            // OneSignal Initialization
            OneSignal.setAppId(ONESIGNAL_APP_ID);
            OneSignal.setExternalUserId(user_data_aux.user_id+'');

            // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
            // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
            OneSignal.promptForPushNotificationsWithUserResponse();

            //Method for handling notifications received while app in foreground
            OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            ("OneSignal: notification will show in foreground:", notificationReceivedEvent);
            let notification = notificationReceivedEvent.getNotification();
            ("notification: ", notification);
            const data = notification.additionalData
            ("additionalData: ", data);
            // Complete with null means don't show a notification.
            notificationReceivedEvent.complete(notification);
            });

            //Method for handling notifications opened
            OneSignal.setNotificationOpenedHandler(notification => {
            ("OneSignal: notification opened:", notification);
        });
            
        }
        fetchData2();
    }, []); 

    useEffect(()=>{
        async function fetchData(){
            await loadSpends();
        }
        fetchData();
    }, [mes_ano_selecionado])

    useFocusEffect(
        React.useCallback(() => {

            async function fetchData(){
                await loadSpends();
            }
            fetchData();
            
            return () => {

                // alert('Screen was unfocused');
                // Useful for cleanup functions

            };
        }, [])
    );
    
    const cadastrar_planilha = () =>{
        navigation.navigate("Sheets") 
        // ("Opa")       
    }

    const openCadastroSpend = async ()=>{
        const default_sheet_aux = await localStorage.getData("@DEFAULT_SHEET");
        if(default_sheet_aux && default_sheet_aux !== "NONE" && default_sheet_aux !== ""){
            setDefaultSheet(default_sheet_aux);
            navigation.navigate('NewSpend', {atualizaDespesa:false})
        }
       
    }

    return(
        
        <SafeAreaView style={home_style.container}>
            <LinearGradient start={{x:0.0,y:0.4}} end={{x:0.5,y:1.0}} location={[0,1]} colors={[colors.primaria, colors.secundaria]} style={home_style.container_top} >

                <View style={{flex:1, flexDirection:'column',marginTop:10,paddingHorizontal:'5%'}} >
                    <View style={{ flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}} >
                        <View style={{flexDirection:'column'}} >
                            <Text style={{fontFamily:'Roboto-Regular',fontSize:16,color:colors.branco}} >Olá</Text>
                            <Text style={{fontFamily:'Roboto-Medium',color:colors.branco,fontSize:22}} >{nickname}</Text>
                            
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}} >
                            <PopupMenu/>
                            {/* <Icon name='bell' size={30} color=colors.branco /> */}
                            {/* <Image source={require('../assets/images/avatar.jpg')} resizeMode='cover' style={{width:40,height:40,borderRadius:20,marginLeft:15}} /> */}
                        </View>
                    </View>

                    <View style={{flexDirection:'row',marginTop:25,justifyContent:'space-between',alignItems:'center', paddingBottom:8}} >
                        <View style={{flexDirection:'column'}} >
                            <Text style={{color:colors.branco,fontSize:30,fontFamily:'Roboto-Bold'}} >{ total_gastos }</Text>
                            <Text style={{color:colors.cinza_1,fontFamily:'Roboto-Regular-Italic',fontSize:14}} >Gastos totais</Text>
                        </View>
                        <View>
                            <MembrosPlanilha></MembrosPlanilha>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View style={home_style.container_under}>
                <MonthSelector ref={atualizaFiltroMeses} setMesSelecionado = {setMesSelecionado} mes_ano_selecionado = {mes_ano_selecionado}/>
                {corpo}
                <BotaoAdicionar
                    funcao = {openCadastroSpend}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemLista:{ 
        flexDirection:'row',
        width:'100%',
        borderWidth:1,
        borderColor:colors.cinza_1,
        borderRadius:7,
        paddingRight:10,
        marginBottom:6,
        paddingHorizontal:5,
        flex:9,
        paddingVertical:7
    },
    fecharCiclo:{
        borderRadius:7,
        backgroundColor:colors.primaria,
        paddingHorizontal:10,
        paddingVertical:10,
        
    }
})

export default Home;

