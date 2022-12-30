module.exports = app =>{
    const get = (req, res)=>{
        
        var sql = ``;

        if(req.query.type == "user"){
            sql = `
                SELECT 	TB_USERS.NICKNAME
                        ,sum(TB_SPENDS.VALUE) AS TOTAL
                FROM TB_SPENDS
                    INNER JOIN TB_USERS ON
                        TB_SPENDS.OWNER_ID = TB_USERS.USER_ID
                WHERE 	(month(TB_SPENDS.DATE) = ${req.query.month} AND year(TB_SPENDS.DATE) = ${req.query.year})
                        AND TB_SPENDS.SPREAD_SHEET_ID = ${req.query.spread_sheet_id}
                GROUP BY TB_USERS.NICKNAME;
            `;
        }else if(req.query.type == "month"){
            sql = `
                SELECT 	month(TB_SPENDS.DATE) AS MES
                        ,sum(TB_SPENDS.VALUE) AS TOTAL
                FROM TB_SPENDS
                WHERE 	date(TB_SPENDS.DATE) >= date_sub(date(now()), INTERVAL 6 MONTH)
                        AND TB_SPENDS.SPREAD_SHEET_ID = ${req.query.spread_sheet_id}
                GROUP BY month(TB_SPENDS.DATE);
            `; 
        }else if(req.query.type == "tag"){
            sql = `
                SELECT 	TB_TAGS.NAME
                        ,sum(TB_SPENDS.VALUE) AS TOTAL
                FROM TB_SPENDS
                    INNER JOIN TB_TAGS ON
                        TB_SPENDS.TAG_ID = TB_TAGS.TAG_ID
                WHERE 	(month(TB_SPENDS.DATE) = ${req.query.month} AND year(TB_SPENDS.DATE) = ${req.query.year})
                        AND TB_SPENDS.SPREAD_SHEET_ID = ${req.query.spread_sheet_id}
                GROUP BY TB_TAGS.NAME;
            `;
        }

        
        parametros = [];
        console.log(req.query, sql)

        app.db.query(sql, [parametros], (err, results) =>{
            if(err){
                return res.status(405).send('Erro ao executar processo!');
            }
            res.status(200).json(results);
        });
    };

    return {get};
}