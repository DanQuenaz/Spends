const OneSignal = require("onesignal-node")
const { restApiOS, appOSId } = require('../.env')

module.exports = app => {

    const notification_user = async (usersId, stringNotification) =>{
        
        const client = new OneSignal.Client(appOSId, restApiOS);
    
        const notification = {
            name:'Spends',
            contents: {
                'tr': 'Yeni bildirim',
                'en': stringNotification,
            },
            include_external_user_ids: usersId,
            channel_for_external_user_ids: "push",
            isAndroid: true
        };
        
        try {
            const response = await client.createNotification(notification);
            
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    };

    const notification_user_email = async (usersId, stringNotification) =>{
        
        const client = new OneSignal.Client(appOSId, restApiOS);
    
        const notification = {
            name:'Spends',
            contents: {
                'tr': 'Yeni bildirim',
                'en': stringNotification,
            },
            include_external_user_ids: usersId,
            channel_for_external_user_ids: "email",
            email_subject:"TESTE",
            email_body:"TESTE2",
            isAndroid: true
        };
        
        try {
            const response = await client.createNotification(notification);
            
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    };
    

    return {notification_user, notification_user_email}
            
};