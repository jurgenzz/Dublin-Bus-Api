exports.index = function(req, res){
    res.render('getstarted');
};

exports.bus = function (req, res) {
    var name = req.params.name;
    res.render('busRTPI/' + name);
};

exports.luas = function (req, res) {
    var name = req.params.name;
    res.render('luasRTPI/' + name);
};