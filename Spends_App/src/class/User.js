export default class User{

    constructor(){};
    
    static user = {};
    static defaultSpreadSheet = "";

    static getUser(){
        return User.user;
    };

    static setUser(value){
        User.user = value;
    };

    static getDefaultSpreadSheet(){
        return User.defaultSpreadSheet;
    };

    static setDefaultSpreadShet(value){
        User.defaultSpreadSheet = value;
    };

    static clearData(){
        User.user = {};
        User.defaultSpreadSheet = "";
    }
}