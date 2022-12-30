module.exports = app => {

    app.route('/')
        .get(function(req, res) {
            res.send('<h1>Opa</h1>');
          });
    
    app.route('/signup')
        .post(app.api.user.new_user);

    app.route('/signin')
        .post(app.api.auth.signin);

    app.route('/sheets')
        .all(app.config.passport.authenticate())
        .post(app.api.sheets.new_sheet)
        .get(app.api.sheets.get_sheets)
        .put(app.api.sheets.rename_sheet);
    
    app.route('/sheets/del')
        .all(app.config.passport.authenticate())
        .post(app.api.sheets.del_sheet);

    app.route('/sheets/close')
        .all(app.config.passport.authenticate())
        .get(app.api.sheets.close_spends);
    
    app.route('/sheets/invite')
        .all(app.config.passport.authenticate())
        .post(app.api.sheets.add_user_sheet);

    app.route('/spends')
        .all(app.config.passport.authenticate())
        .get(app.api.spends.get)
        .post(app.api.spends.post);
    
    app.route('/spends/del')
        .all(app.config.passport.authenticate())
        .get(app.api.spends.del);

    app.route('/spends/edit')
        .all(app.config.passport.authenticate())
        .post(app.api.spends.edit);
    
    app.route('/tags')
        .all(app.config.passport.authenticate())
        .get(app.api.tags.get)
        .post(app.api.tags.post);

    app.route('/tags/del')
        .all(app.config.passport.authenticate())
        .get(app.api.tags.del);

    app.route('/charts')
        .get(app.api.charts.get);

    app.route('/spends/months')
        .all(app.config.passport.authenticate())
        .get(app.api.spends.months);


};