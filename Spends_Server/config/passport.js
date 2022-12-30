const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }
    
    const strategy = new Strategy(params, (payload, done) => {
        
        console.log("PAYLOAD:" + payload)
        
        sql = ` SELECT  USER_ID
                        ,NICKNAME
                FROM TB_USERS
                WHERE USER_ID = ? 
        `
        parametros = [[payload.id]]
        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => done(err, false);
            }
            user = results[0]

            if (user) {
                done(null, { id: user.USER_ID, nickname: user.NICKNAME })
            } else {
                done(null, false)
            }
        });
    })

    passport.use(strategy)

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false }),
    }
}