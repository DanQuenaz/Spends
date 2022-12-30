import React, {useState, useEffect, useImperativeHandle, forwardRef} from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions} from "react-native";

import moment from "moment";
import colors from "../../styles/colors";

import { useApi } from "../../Hooks/useApi";
import User from "../../class/User";


const MonthSelector = (props, ref) =>{
    const [ultimos_meses, setUltimosMeses] = useState([]);

    useImperativeHandle(ref, () => ({
        geraMeses: () => { geraMeses() }
    }))

    const geraMeses = async ()=>{
        try{
            const result = await useApi(`/spends/months?spread_sheet_id=${User.getDefaultSpreadSheet()}`);
            if(result.status == 200){
                var meses_aux = []
                result.data.forEach(item=>{
                    meses_aux.push( 
                        {
                            label:moment().month(item.MONTH_SPEND-1).format('MMM') + '-' + moment().year(item.YEAR_SPEND).format('YY'),
                            mes_ano:{
                                mes: parseInt(moment().month(item.MONTH_SPEND-1).format('MM')),
                                ano: parseInt(item.YEAR_SPEND),
                            },
                            id:item.MONTH_SPEND + '' + item.YEAR_SPEND
                        } 
                    );
                });
                setUltimosMeses(meses_aux);

            }else{
                console.log("Erro")
            }
        }catch(e){
            console.log("Erro aqui", e)
        }

    };

    useEffect(()=>{
        const fetchData = ()=>{
            geraMeses()
        };
        fetchData();
    }, []);

    

    return(
        <View>
            <FlatList
            data={ultimos_meses}
            keyExtractor={(item)=>item.id}
            horizontal={true}
            renderItem={({item})=>(
                <TouchableOpacity style={[styles.itemFiltroMes, {backgroundColor: props.mes_ano_selecionado.mes==item.mes_ano.mes && props.mes_ano_selecionado.ano==item.mes_ano.ano ? colors.cinza_3 : colors.cinza_2 } ]} onPress={()=>{props.setMesSelecionado(item.mes_ano);}}>
                    <Text style={{color:colors.branco}}>{item.label}</Text>
                </TouchableOpacity>
            )}
        />
        </View>
    );

};

const styles = StyleSheet.create({

    itemFiltroMes:{
        backgroundColor:colors.cinza_3,
        marginHorizontal:3,
        marginVertical:5,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        width:Dimensions.get("window").width/6.0,
        height:30,
        borderRadius:8
    },

});

export default forwardRef(MonthSelector);


