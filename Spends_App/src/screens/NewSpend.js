import React, {useEffect, useState} from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, StyleSheet, ToastAndroid } from "react-native";
import CurrencyInput from 'react-native-currency-input';
import Tooltip from "react-native-walkthrough-tooltip";

import { useApi } from "../Hooks/useApi";

import User from "../class/User";

import BouncyCheckbox from "react-native-bouncy-checkbox";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from "@react-navigation/native";
import { TelaSimples } from "../components/TelaSimples";
import { ScrollView } from "react-native";


import { PopupNovaTag } from "../components/PopUpNovaTag";

import colors from "../styles/colors";
import { BackCard } from "../components/BackCard";
import DTPicker from "../components/DTPicker/DTPicker";
import { stringDate } from './../functions/stringDate';
import DropDownPicker from "react-native-dropdown-picker";
import { formatToReal } from './../functions/number';
import { Use } from "react-native-svg";

const NewSpend = () =>{

    const [valor_spend, setValorSpend] = useState(null);
    const [descricao_spend, setDescricaoSpend] = useState("");
    const [tp_descricao_spend, setTpDescricaoSpend]= useState(false);
    const [tp_valor_spend, setTpValorSpend]= useState(false);
    const [tp_texto_descricao_spend, setTpTextoDescricaoSpend]= useState("");
    const [tp_texto_valor_spend, setTpTextoValorSpend]= useState("");
    const [cadastrar_spend, setCadastrarSpend] = useState(false);
    const [gasto_fixo, setGastoFixo] = useState(false);
    const [open_tags, setOpenTags] = useState(false);
    const [value_tags, setValueTags] = useState(1);
    const [items_tags, setItemsTags] = useState([]);
    const [num_cadastro, setNumCadastro] = useState(0);
    const [tags_selector, setTagsSelector] = useState(null);
    const [user_id, setUserId] = useState(null);
    const [parcelas, setParcelas] = useState(1);

    const [data_despesa, setDataDepesa] = useState(new Date());

    const route = useRoute();
    const navigation = useNavigation();

    const loadTags = async () =>{
        try{
            const result = await useApi(`/tags?owner_id=${User.getUser().user_id}`, null, 'GET');
            if(result.status == 200){
                if(result.data[0]){
                    setItemsTags(result.data);
                    // console.log(result.data, user_id);
                }
            }
        }catch(e){
            console.log(e)
        }
    };

    useEffect(()=>{
        setUserId( User.getUser().user_id );
        loadTags();

        if(route.params.atualizaDespesa){
            console.log(route.params)
            setValorSpend(route.params.valor);
            setDescricaoSpend(route.params.descricao);
            setGastoFixo(route.params.fixado);
            setValueTags(route.params.tag);
            setDataDepesa(route.params.data);
            setParcelas(route.params.parcelas+"");
        };
        
    }, []);

    useEffect(()=>{
        async function fetchData(){
            // console.warn(valor_spend, num_cadastro)
            if((valor_spend !== "" && valor_spend != null) && descricao_spend !== ""){
                let bodyRequest = {
                    owner_id: user_id,
                    spread_sheet_id: parseInt(User.getDefaultSpreadSheet()),
                    tag_id: value_tags,
                    fixed: gasto_fixo,
                    total_value: valor_spend,
                    initial_date: data_despesa,
                    installments:parcelas,
                    notification: `${User.getUser().nickname} cadastrou ${descricao_spend} - ${formatToReal(valor_spend)} (${parcelas}x ${formatToReal(valor_spend/parcelas)})`,
                    installments_info:[]
                };
                if(parcelas > 1){
                    let valor_parcela = valor_spend/parcelas;
                    for(let i =0; i<parcelas; i++){
                        var data_aux = new Date(data_despesa);
                        console.log(i, data_aux);
                        bodyRequest.installments_info.push({
                            description: descricao_spend + ` ${i+1}/${parcelas}`,
                            value: valor_parcela,
                            date: data_aux.setMonth(data_aux.getMonth()+i)
                        });
                    };
                        try{
                            console.log(bodyRequest)
                            const result = await useApi("/spends", bodyRequest, "POST");
                            if(result.status == 200){
                                navigation.navigate("Home");
                                
                            }else{
                                Alert.alert("Erro", "Falha ao cadastrar despesa");
                            }
                        }catch(e){
                            Alert.alert("Erro", "Falha ao cadastrar despesa"); 
                        } 
                    
                }
                else{
                    bodyRequest.installments_info.push({
                        description: descricao_spend,
                        value: valor_spend,
                        date: data_despesa
                    })
                    try{
                        const result = await useApi("/spends", bodyRequest, "POST");
                        if(result.status == 200){
                            navigation.navigate("Home");
                            
                        }else{
                            Alert.alert("Erro", "Falha ao cadastrar despesa");
                        }
                    }catch(e){
                        Alert.alert("Erro", "Falha ao cadastrar despesa"); 
                    } 

                } 
            }{
                if(num_cadastro>0){
                    
                    if(valor_spend == "" || valor_spend == null){
                        ToastAndroid.show("Valor não pode ser vazio", ToastAndroid.SHORT);
                    }else if(descricao_spend == ""){
                        ToastAndroid.show("Descrição não pode ser vazia", ToastAndroid.SHORT);
                    }
                }
            }
        }
        fetchData();
    }, [cadastrar_spend]);

    return(
        (
            <TelaSimples titulo='Nova Despesa'>
                <View style={{flex:1,  paddingTop:10}}>
                    <View style={{flex:0.25, paddingBottom:5}}>
                        <BackCard>
                            <View style={{flex:1, justifyContent:'space-between'}}>
                                <View>
                                    <Text style={{paddingLeft:5, fontSize:22, color:colors.branco}}>Valor</Text>
                                </View>
                                <View style={{flex:1, marginHorizontal:20}}>
                                    <Tooltip
                                        isVisible={tp_valor_spend}
                                        content={<Text>{tp_texto_valor_spend}</Text>}
                                        placement="top"
                                        onClose={() => setTpValorSpend(false)}
                                    >
                                        <CurrencyInput
                                            value={valor_spend}
                                            onChangeValue={setValorSpend}
                                            prefix="R$"
                                            delimiter="."
                                            separator=","
                                            precision={2}
                                            style = {{  width:'100%',
                                                fontSize:40,
                                                fontWeight:'bold',
                                                borderBottomColor:colors.preto_2,
                                                borderBottomWidth:0.9,
                                                borderBottomColor:colors.branco,
                                                color:colors.branco,
                                                textAlign:'center'
                                                        
                                            }}
                                            
                                            keyboardType="numeric"
                                            placeholder="R$0,00"
                                            placeholderTextColor={colors.branco}
                                        />
                                    </Tooltip>
                                </View>
                            </View>
                                
                        
                            
                        </BackCard>
                    </View>

                    <View style={{flex:0.3, paddingBottom:5}}>
                        <BackCard>
                            <View>
                                <Text style={{paddingLeft:5, fontSize:22, paddingBottom:10, marginRight:10, color:colors.branco}}>Descrição</Text>
                            </View>
                            <View style={{flex:1, paddingVertical:10, width:'100%', justifyContent:'space-between'}}>
                                <View style={{paddingBottom:0}}>
                                    <Tooltip
                                        isVisible={tp_descricao_spend}
                                        content={<Text>{tp_texto_descricao_spend}</Text>}
                                        placement="top"
                                        onClose={() => setTpDescricaoSpend(false)}
                                    >
                                        <TextInput
                                            style = {{  width:'100%',
                                                        fontSize:20,
                                                        fontWeight:'bold',
                                                        color:colors.preto,
                                                        backgroundColor:colors.branco,
                                                        borderRadius:8
                                                                
                                                    }}
                                            value={descricao_spend}
                                            placeholderTextColor={colors.branco}
                                            onChangeText={(text) => { setDescricaoSpend(text) } }
                                        />
                                    </Tooltip>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginHorizontal:5}}>
                                <DTPicker setDataDepesa={setDataDepesa}/>
                                <TextInput 
                                    style={{backgroundColor:colors.branco, borderRadius:8, textAlign:'center'}}
                                    placeholder="Parcelas"
                                    keyboardType="numeric"
                                    value={parcelas}
                                    onChangeText={(text)=>{setParcelas(text)}}
                                />
                            </View>
                            
                            
                        </BackCard>
                    </View>
                    
                    
                    <View style={{flex:0.2}}>
                        <BackCard>

                            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                                <Text style={{paddingLeft:5, fontSize:22, paddingBottom:10, marginRight:10, color:colors.branco}}>Categoria</Text>
                                <PopupNovaTag user_id = {user_id} funcReload = {loadTags} tag_id={value_tags}/>  
                            </View>
                            <View style={{flex:1}}>
                                <ScrollView contentContainerStyle ={[styles.list]}>
                                    {items_tags.map((item, i)=>(
                                        <TouchableOpacity onPress={()=>{ setValueTags(item.id) }} style={[styles.listItem, {backgroundColor: item.id == value_tags ? colors.secundaria : colors.terciaria}]} key={i}>
                                            <Text style={{color:colors.branco, fontSize:18}}>{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </BackCard>
                    </View>
                    
                    <View style={{flex:0.1, flexDirection:'row',  alignItems:'baseline', marginTop:5}}>
                        <BackCard>
                            <BouncyCheckbox
                                size={25}
                                fillColor={colors.primaria}
                                text="Fixar despesa"
                                unfillColor={colors.branco}
                                iconStyle={{ borderColor: "black" }}
                                innerIconStyle={{ borderWidth: 0, borderRadius: 0}}
                                textStyle={{ fontFamily: "JosefinSans-Regular", color:colors.branco, textDecorationLine: "none" }}
                                style={{paddingTop:10, paddingBottom:10}}
                                onPress={(isChecked) => {setGastoFixo(isChecked)}}
                            />
                        </BackCard>
                    </View>

                    <View style={{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity
                            style={styles.botaoSave}
                            onPress = { () => {
                                setNumCadastro(1);
                                setCadastrarSpend(!cadastrar_spend);
                            }}
                        >
                            <Icon name='check' size={40} color={colors.branco}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TelaSimples>
        )
    )
};

const styles = StyleSheet.create({
    list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent:'flex-start'
        
    },
    listItem:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf: 'flex-start',
        borderColor:colors.terciaria,
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:5,
        paddingVertical:5,
        margin:2
    },
    botaoSave:{
        borderRadius:100,
        backgroundColor:colors.primaria,
        paddingHorizontal:25,
        paddingVertical:25
        
    },
    maisTag:{
        borderWidth: 1,
        borderColor: colors.preto_2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:5,
        paddingVertical:5,
        position: 'absolute',
        backgroundColor: colors.branco,
        borderRadius: 100,
    },
    dataDespesa:{
        color:colors.branco,
        fontSize:22,
        marginBottom:10
    }
})

export default NewSpend;