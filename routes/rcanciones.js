module.exports = function(app) {
    app.get("/canciones", function(req, res) {
        let respuesta = 'Nombre: ' + req.query.nombre + '<br>'
            + 'Autor: '+ req.query.autor;
        res.send(respuesta);
    });

    app.get('/canciones/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });

    app.get('/canciones/:genero/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });

    app.post('/cancion', function(req, res) {
        res.send("Cancion agreagda:"+req.body.nombre + "<br>"
        + " genero :" + req.body.genero + "<br>" +
        " precio : "+ req.body.precio);
    });
};