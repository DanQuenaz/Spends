import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ServerApi{
  storeData = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, value)
      } catch (e) {
        throw e
      }
  };

  getData = async (key) => {
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

  removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      throw e
    }
};
}
