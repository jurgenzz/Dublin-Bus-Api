exports.stopNo = function (req, res) {
    var name = req.params.name;
    res.render('stopNr/' + name);
};

exports.index = function(req, res){
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('dash/' + name);
};
