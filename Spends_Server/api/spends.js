const { application } = require('express');
const moment = require('moment');

module.exports = app => {
    const post = (req, res) => {
        moment.locale('pt-br');

        if(req.body.is_update){
            del(req, res);
        };
        
        let sql = `INSERT INTO TB_SPENDS(OWNER_ID, SPREAD_SHEET_ID, TAG_ID, DESCRIPTION, INSTALLMENT_DESCRIPTION, TOTAL_VALUE, VALUE, CLOSED, FIXED, TOTAL_INSTALLMENTS, INITIAL_DATE, DATE) VALUES ?`
        
        let installments_aux = req.body.installments_info
        let first_installment = installments_aux.shift()

        let parametros = [[req.body.owner_id, req.body.spread_sheet_id, req.body.tag_id, req.body.description, first_installment.installment_description, req.body.total_value, first_installment.value, 0, req.body.fixed, req.body.installments, moment(req.body.initial_date).format("YYYY-MM-DD HH:mm:ss"), moment(first_installment.date).format("YYYY-MM-DD HH:mm:ss")]]


        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao inserir despesa", err, new Date())
                return err => res.status(400).json(err);
            }

            let sql = `INSERT INTO TB_SPENDS(INSTALLMENT_ID, OWNER_ID, SPREAD_SHEET_ID, TAG_ID, DESCRIPTION, INSTALLMENT_DESCRIPTION, TOTAL_VALUE, VALUE, CLOSED, FIXED, TOTAL_INSTALLMENTS, INITIAL_DATE, DATE) VALUES ?`
            let parametros = []
            let insertId = results.insertId

            installments_aux.forEach(element=>{
                parametros.push([insertId, req.body.owner_id, req.body.spread_sheet_id, req.body.tag_id, req.body.description, element.installment_description, req.body.total_value, element.value, 0, req.body.fixed, req.body.installments, moment(req.body.initial_date).format("YYYY-MM-DD HH:mm:ss"), moment(element.date).format("YYYY-MM-DD HH:mm:ss")])
            });

            app.db.query(sql, [parametros], (err, results, fields)=>{
                if (err) {
                    console.log("Erro ao inserir despesa", err, new Date())
                    return err => res.status(400).json(err);
                }
                let sql = ` SELECT USER_ID
                    FROM TB_USERS_SHEETS
                    WHERE   USER_ID != ${req.body.owner_id}
                            AND SPREAD_SHEET_ID = ?
                `
                parametros = [[req.body.spread_sheet_id]]

                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        console.log("Erro ao enviar notificacao", err, new Date())
                        // return err => res.status(400).json(err);
                    };
                    const users_keys = []
                    results.forEach(element => {
                        users_keys.push(element.USER_ID+'')
                    });

                    var stringNotification = req.body.notification;
                    
                    if(!!users_keys.length){
                        app.api.onesignal.notification_user(users_keys, stringNotification);
                    }
                });

            });
            return res.status(200).send()
        });
    }


    const get = (req, res) => {
        sql = `SELECT   TB_SPENDS.SPEND_ID
                        ,TB_USERS.NICKNAME
                        ,TB_SPREAD_SHEETS.NAME
                        ,TB_TAGS.NAME
                        ,TB_SPENDS.DESCRIPTION
                        ,TB_SPENDS.INSTALLMENT_DESCRIPTION
                        ,TB_SPENDS.TOTAL_VALUE
                        ,TB_SPENDS.VALUE
                        ,TB_SPENDS.INITIAL_DATE
                        ,TB_SPENDS.DATE
                        ,TB_SPENDS.TOTAL_INSTALLMENTS
                        ,TB_SPENDS.FIXED
                        ,TB_SPENDS.TAG_ID
                        ,TB_SPENDS.OWNER_ID
                FROM TB_SPENDS
                    INNER JOIN TB_SPREAD_SHEETS ON
                        TB_SPENDS.SPREAD_SHEET_ID = TB_SPREAD_SHEETS.SPREAD_SHEET_ID
                    INNER JOIN TB_USERS ON
                        TB_SPENDS.OWNER_ID = TB_USERS.USER_ID
                    INNER JOIN TB_TAGS ON
                        TB_SPENDS.TAG_ID = TB_TAGS.TAG_ID
                    WHERE   TB_SPENDS.CLOSED = 0
                            AND TB_SPENDS.SPREAD_SHEET_ID = ?
                            AND (
                                    (
                                        month(TB_SPENDS.DATE) = ${req.query.month}
                                        AND year(TB_SPENDS.DATE) = ${req.query.year}
                                    )
                                    OR TB_SPENDS.FIXED = 1
                                )
                    ORDER BY TB_SPENDS.DATE DESC`
        parametros = [[req.query.spread_sheet_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao obter despesas", err, new Date())
                return err => res.status(400).json(err);
            }

            return res.status(200).json(results)
        });
    };

    const del = (req, res) => {
        ("DEL:", req.query, req.body)
        sql = `
            DELETE FROM TB_SPENDS
            WHERE   SPEND_ID = ?
                    OR INSTALLMENT_ID = ${req.query.spend_id}
        `;
        parametros = [[req.query.spend_id]];
        // (sql)
        app.db.query(sql, [parametros], (err, results, fields)=>{
            if(err){
                console.log("Erro ao deletar despesa", err, new Date())
                return err=>res.status(400).json(err);
            }
            return res.status(200).send("Despesa deletada.")
        });
    };

    const edit = (req, res) => {
        
        const sql = `
            UPDATE TB_SPENDS
            SET DESCRIPTION = '${req.body.description}',
                VALUE = ${req.body.value},
                FIXED = ${req.body.fixed},
                TAG_ID = ${req.body.tag_id},
                DATE = '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}'
            WHERE SPEND_ID = ?

        `;
        // (req.body, sql)
        parametros = [[req.body.spend_id]];
        app.db.query(sql, [parametros], (err, results, fields)=>{
            if(err){
                console.log("Erro ao editar despesa", err, new Date())
                return err=>res.status(400).json(err);
            }
            return res.status(200).send("Despesa atualizada.")
        });
    };

    const months = (req, res)=>{
        let sql = `
            SELECT DISTINCT MONTH(DATE) AS MONTH_SPEND, YEAR(DATE) AS YEAR_SPEND
            FROM TB_SPENDS
            WHERE SPREAD_SHEET_ID = ?
            AND DATE >= DATE_SUB(curdate(), INTERVAL 60 DAY)
            ORDER BY YEAR_SPEND, MONTH_SPEND;
        `;

        (req.query)

        let parametros = [[req.query.spread_sheet_id]];

        app.db.query(sql, [parametros], (err, results, fields)=>{
            if(err){
                console.log("Erro ao obter meses de despesa", err, new Date())
                return err => res.status(400).json(err);
            }
            return res.status(200).json(results);
        });

    };



    return { post, get, del, edit, months }
}