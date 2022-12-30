const bcrypt = require('bcrypt-nodejs')
const md5 = require('md5');

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const new_user = (req, res) => {
        // console.log(req.body)

        obterHash(req.body.password, hash => {
            const password = hash
            // console.log(password)

            sql = `SELECT EMAIL FROM TB_USERS WHERE UPPER(EMAIL) = UPPER(?)`
            parametros = [[req.body.email]]

            app.db.query(sql, [parametros], (err, results, fields)=>{
                if(err){
                    return err => res.status(500).json(err)
                }
                email = results[0]

                if(!email){
                    sql = `INSERT INTO TB_USERS(NAME, EMAIL, NICKNAME, PASSWORD, ACCOUNT_TYPE, ACCOUNT_VALIDATE, ACCOUNT_CODE_VALIDATE) VALUES ?`
                    parametros = [[req.body.name, req.body.email, req.body.nickname, password, 0, 0, md5(req.body.email)]]

                    app.db.query(sql, [parametros], (err, results, fields) => {
                        if (err) {
                        return err => res.status(400).json(err);
                        }
                        // var stringNotification = `TESTE`;
                        // app.api.onesignal.notification_user_email([req.body.email], stringNotification);

                        return res.status(201).send()
                    });
                }
                else{
                    res.status(200).send('Usuário já cadastrado.')
                }
            })
        })
    }

    const get_user = (req, res) => {
        // console.log(req.body)
        const user =  app.db('TB_USERS')
            .whereRaw("LOWER(NICKNAME) = LOWER(?)", req.body.nickname)
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.PASSWORD, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).send('A senha informada é inválida!')
                }

                const payload = {
                    id: user.USER_ID,
                    nickname: user.nickname
                }

                res.json({
                    id: user.USER_ID,
                    nickname: user.nickname,
                    token: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    return { new_user, get_user }
}