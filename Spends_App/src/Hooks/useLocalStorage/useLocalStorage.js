import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalStorage = ()=>{
    const storeData = async (key, value) => {
        try {
        await AsyncStorage.setItem(key, value)
        } catch (e) {
        throw e
        }
    };

    const getData = async (key) => {
        try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            return value;
        }
        else{
            return null;
        }
        } catch(e) {
        throw e;
        }
    };

    const removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            throw e
        }
    };

    return {storeData, getData, removeData}
};

export default useLocalStorage;
