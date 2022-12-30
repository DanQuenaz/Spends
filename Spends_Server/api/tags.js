

module.exports = app => {
    
    const post = (req, res) => {
       
        sql = `INSERT INTO TB_TAGS(OWNER_ID, NAME, DEFAULT_TAG) VALUES ?`
        parametros = [[req.body.owner_id, req.body.name, 0 ]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).send()
        });
    };


    const get = (req, res) => {
        
        sql = ` SELECT  TAG_ID as id
                        ,NAME as label
                FROM TB_TAGS
                WHERE   DEFAULT_TAG = 1
                        OR OWNER_ID = ?`
        parametros = [[req.query.owner_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).json(results)
        });
    };

    const del = (req, res) => {
        
        sql = ` DELETE FROM TB_TAGS
                WHERE   TAG_ID = ?`
        parametros = [[req.query.tag_id]]

        app.db.query(sql, [parametros], (err, results, fields) => {
            if (err) {
                return err => res.status(400).json(err);
            }

            return res.status(200).send("Tag deletada.")
        });
    };

    return { post, get, del }
}