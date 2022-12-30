const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    
    const signin = async (req, res) => {
        
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }

        sql = ` SELECT  USER_ID
                        ,NAME
                        ,EMAIL
                        ,NICKNAME
                        ,PASSWORD
                FROM TB_USERS 
                WHERE UPPER(EMAIL) = UPPER(?)`
        parametros = [[req.body.email]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
              return err => res.status(400).send('Erro ao executar processo.')
            }
            const user = results[0];
            
            if(user){
               

                bcrypt.compare(req.body.password, user.PASSWORD, (err, isMatch) => {
                    if (err || !isMatch) {
                        return res.status(401).send('A senha informada é inválida!')
                    }

                    const payload = {
                        id: user.USER_ID,
                        nickname: user.nickname
                    }

                    res.status(200).json({
                        user_id: user.USER_ID,
                        nickname: user.NICKNAME,
                        token: jwt.encode(payload, authSecret),
                    });
                });
            }
            else{
                return res.status(400).send('Usuario invalido.')
            }
            
          });


        // if (user) {
        //     bcrypt.compare(req.body.password, user.PASSWORD, (err, isMatch) => {
        //         if (err || !isMatch) {
        //             return res.status(401).send('A senha informada é inválida!')
        //         }

        //         const payload = {
        //             id: user.USER_ID,
        //             nickname: user.nickname
        //         }

        //         res.json({
        //             id: user.USER_ID,
        //             nickname: user.nickname,
        //             token: jwt.encode(payload, authSecret),
        //         })
        //     })
        // } else {
        //     res.status(400).send('Usuário não cadastrado!')
        // }
    }

    return { signin }
}