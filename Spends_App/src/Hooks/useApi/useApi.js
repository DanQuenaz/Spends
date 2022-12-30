import axios from "axios";



const useApi = async (url, data, type) =>{
    const baseUrl = "http://192.168.100.27:2911";
    // const baseUrl = "http://132.226.242.187:2911";
    
    const request_info = {
        method: type,
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        data:data
    };
    try{
        const response  = await axios(baseUrl + url, request_info);
        return response;
    }catch(e){
        throw e;
    }; 
}

export default useApi;