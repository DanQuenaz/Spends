var md5 = require('md5');
const moment = require('moment');

module.exports = app => {
    
    const new_sheet = (req, res) => {
        console.log("Criando nova planilha", new Date())
        moment.locale('pt-br');

        const baseCode= ['s2k4m5n7q8',
            'v2z3m5n6p8',
            's2z4m5n6q8',
            'q8r2y3k5n6',
            'x2y2j3k5n6',
            'r9s2k4m5n7',
            '2j3k5n6p7r',
            'z2j3m5n6p7',
            'x2j3m5n6p8',
            'd2z2j3m5n6' ]
        

        app.db.query(`START TRANSACTION`);

        sql = `INSERT INTO TB_SPREAD_SHEETS(OWNER_ID, NAME, INVITE_CODE, CREATION_DATE) VALUES ?`
        
        invite_code_uncript = req.body.owner_id + req.body.name + moment()
        invite_code = md5(invite_code_uncript) + baseCode[Math.floor(Math.random() * 10)] 
        
       
        
        parametros = [[req.body.owner_id, req.body.name, invite_code, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao criar planilha", err, new Date())
                app.db.query(`ROLLBACK`);
                return res.status(400).json(err);
            }

            dados_retorno = {
                spread_sheet_id:results.insertId,
                invite_code:invite_code
            }

            sql = `INSERT INTO TB_USERS_SHEETS(USER_ID, SPREAD_SHEET_ID) VALUES ?`
            parametros = [[req.body.owner_id, results.insertId]]

            app.db.query(sql, [parametros], (err, results, fields) => {
                if (err) {
                    console.log("Erro ao criar planilha", err, new Date())
                    app.db.query(`ROLLBACK`);
                    return res.status(400).json(err);
                }
                app.db.query(`COMMIT`);
                console.log("Planilha criada", new Date())
                return res.status(201).json(dados_retorno)
            });
        });
    };

    const add_user_sheet = (req, res) => {
   
        console.log("Adicionando usuario em planilha", new Date())
        sql = ` SELECT SPREAD_SHEET_ID
                FROM TB_SPREAD_SHEETS
                WHERE INVITE_CODE = ?
        `
        parametros = [[req.body.invite_code]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                
                return res.status(405).json(err);
            }
            if(results[0]){
                spread_sheet_id = results[0].SPREAD_SHEET_ID
                sql = ` INSERT INTO TB_USERS_SHEETS(USER_ID, SPREAD_SHEET_ID)
                        VALUES ?
                `
                parametros = [[req.body.user_id, spread_sheet_id]]
                
                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        console.log("Erro ao adicionar usuario em planilha", err, new Date())
                        return res.status(405).json(err);
                    }

                    console.log("Usuario adicionado em planilha", new Date())
                    return res.status(200).send();
                });
            }else{
                return res.status(401).send("C??digo inv??lido")
            }
        });
    };

    const del_sheet = (req, res) => {
        
        console.log("Deletando planilha", new Date())
        app.db.query(`START TRANSACTION`);

        sql = ` SELECT OWNER_ID
                FROM TB_SPREAD_SHEETS
                WHERE OWNER_ID = ?
        `
        parametros = [[req.body.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao deletar planilha", err, new Date())
                app.db.query(`ROLLBACK`);
                return res.status(405).json(err);
            }

            user = results[0]
            if(user){
                sql = ` DELETE 
                        FROM TB_SPREAD_SHEETS 
                        WHERE SPREAD_SHEET_ID = ?`
                parametros = [[req.body.spread_sheet_id]]

                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        console.log("Erro ao deletar planilha", err, new Date())
                        app.db.query(`ROLLBACK`);
                        return res.status(405).json(err);
                    }

                    app.db.query(`COMMIT`);
                    console.log("Planilha deletada", new Date())
                    return res.status(200).send()
                });
            }else{
                app.db.query(`ROLLBACK`);
                return res.status(401).send("Sem permiss??o para deletar esta planilha.")
            } 
        });
    };

    const rename_sheet = (req, res) => {
        console.log("Renomeando planilha", new Date())
        app.db.query(`START TRANSACTION`);

        sql = ` SELECT OWNER_ID
                FROM TB_SPREAD_SHEETS
                WHERE OWNER_ID = ?
        `
        parametros = [[req.body.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao renomear planilha", err, new Date())
                app.db.query(`ROLLBACK`);
                return res.status(405).json(err);
            }

            user = results[0]
            if(user){
                sql = ` UPDATE TB_SPREAD_SHEETS
                SET NAME = '`+req.body.new_name+`' 
                WHERE SPREAD_SHEET_ID = ?`
                parametros = [[req.body.spread_sheet_id]]

                app.db.query(sql, [parametros], (err, results, fields) => {
                    if (err) {
                        console.log("Erro ao renomear planilha", err, new Date())
                        app.db.query(`ROLLBACK`);
                        return res.status(405).json(err);
                    }

                    app.db.query(`COMMIT`);
                    console.log("PLanilha renomeada", new Date())
                    return res.status(200).send()
                });
            }else{
                app.db.query(`ROLLBACK`);
                return res.status(401).send("Sem permiss??o para alterar esta planilha.")
            } 
        });
    };

    const get_sheets = (req, res) => {
        console.log("Obtendo planilhas", new Date())
        sql = ` SELECT  TB_SPREAD_SHEETS.SPREAD_SHEET_ID
                        ,TB_SPREAD_SHEETS.NAME
                        ,TB_SPREAD_SHEETS.INVITE_CODE
                        ,TB_SPREAD_SHEETS.CREATION_DATE
                        ,TB_USERS.NICKNAME
                        ,v_totais_planilhas.TOTAL_VALUE
                FROM (TB_SPREAD_SHEETS
                    INNER JOIN TB_USERS_SHEETS ON
                            TB_SPREAD_SHEETS.SPREAD_SHEET_ID = TB_USERS_SHEETS.SPREAD_SHEET_ID)
                    INNER JOIN TB_USERS ON
                        TB_SPREAD_SHEETS.OWNER_ID = TB_USERS.USER_ID
                    LEFT JOIN v_totais_planilhas ON
                        TB_SPREAD_SHEETS.SPREAD_SHEET_ID = v_totais_planilhas.SPREAD_SHEET_ID
                WHERE TB_USERS_SHEETS.USER_ID = ? `
        parametros = [[req.query.user_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                console.log("Erro ao obter planilhas", err, new Date())
                return err => res.status(400).send('Erro ao executar processo!');
            }
            res.status(200).json(results);
          });
    };

    const close_spends = (req, res) =>{

        sql = `
            UPDATE TB_SPENDS
            INNER JOIN  TB_SPREAD_SHEETS ON 
                TB_SPENDS.SPREAD_SHEET_ID = TB_SPREAD_SHEETS.SPREAD_SHEET_ID
            SET TB_SPENDS.CLOSED = 1
            WHERE   TB_SPENDS.FIXED != 1
                    AND TB_SPREAD_SHEETS.SPREAD_SHEET_ID = ?
        `;

        parametros = [[req.query.spread_sheet_id]];

        app.db.query(sql, [parametros], (err) =>{
            if(err){
                return res.status(400).send('Erro ao executar processo!');
            }
            res.status(200).send("Gastos fechados.")
        });
    };

    const get_sheet_members = (req, res)=>{
        console.log("Obtendo membros da planilha", new Date())
        const sql = `
            SELECT TU.NICKNAME 
            FROM TB_SPREAD_SHEETS TSS 
                INNER JOIN TB_USERS_SHEETS TUS ON
                    TSS.SPREAD_SHEET_ID = TUS.SPREAD_SHEET_ID 
                INNER JOIN TB_USERS TU ON
                    TU.USER_ID = TUS.USER_ID
            WHERE TSS.SPREAD_SHEET_ID = ?
        `

        const parametros = [[req.query.spread_sheet_id]]

        app.db.query(sql, [parametros], (err, results)=>{
            if(err){
                console.log("Erro ao obter planilhas", err, new Date())
                return res.status(400).send('Erro ao executar processo!');
            }
            res.status(200).json(results);
        });
    };

    const remove_sheet_member = (req, res)=>{
        const sql = `
            DELETE FROM TB_USERS_SHEETS
            WHERE USER_ID = ?
        `
        const parametros = [[req.query.user_id]]

        app.db.query(sql, [parametros], (err)=>{
            if(err){
                console.log("Erro ao remover membro de planilha", err, new Date())
                return res.status(400).send("Erro ao executar processo!");
            }
            res.status(200).send("Usu??rio deletado");
        });
    }

    const get_invite_code_sheet = (req, res)=>{
        const sql = `
            SELECT INVITE_CODE
            FROM TB_SPREAD_SHEETS
            WHERE SPREAD_SHEET_ID = ?
        `
        const parametros = [[req.query.spread_sheet_id]]

        app.db.query(sql, [parametros], (err, results)=>{
            if(err) {
                console.log("Erro ao obter codigo de compartilhamento", err, new Date())
                return res.status(400).send("Erro ao executar query!");
            }
            res.status(200).json(results)
        })
    }

    return { new_sheet, get_sheets, del_sheet, add_user_sheet, rename_sheet, close_spends, get_sheet_members, remove_sheet_member, get_invite_code_sheet }
};