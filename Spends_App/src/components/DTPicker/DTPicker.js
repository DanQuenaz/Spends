import React, {useState} from "react";
import { TouchableOpacity, StyleSheet, Text, Modal, View } from "react-native";
import { Platform } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

import colors from "../../styles/colors";
import { stringDate, stringDateView } from './../../functions/stringDate';

const DTPicker = (props) =>{

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState(stringDateView(new Date()));

    const onChange = (event, selectedDate)=>{
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        props.setDataDepesa(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = stringDateView(tempDate);
        setText(fDate);
    }

    const showMode = (currentMode)=>{
        setShow(true);
        setMode(currentMode);
    }

    return (
        <>
            <View style={styles.dateBox}>
                <TouchableOpacity onPress={()=>{showMode('date')}}>
                    
                    <Text style={styles.texto}>{text}</Text>
                    <Text style={{color:colors.cinza_1}}>Data da despesa</Text>
                </TouchableOpacity>
            </View>
            
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                />
            )}
        </>
        
    )
};

const styles = StyleSheet.create({
    dateBox:{
        alignItems:'center',
        justifyContent:'center'
    },
    texto:{fontSize:28, color:colors.branco}
});

export default DTPicker;