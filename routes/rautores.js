module.exports = function(app, swig) {

    app.get("/autores", function(req, res) {
        let autores = [ {
            "nombre" : "Kurt Cobain",
            "grupo" : "Nirvana",
            "rol" : "Guitarrista"
        },{
            "nombre" : "Chris Slade",
            "grupo" : "ACDC",
            "rol" : "Batería"
        },{
            "nombre" : "Safaera",
            "grupo" : "Bad Bunny",
            "rol" : "Cantante"
        }];

        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores
        });

        res.send(respuesta);
    });

    app.post('/autor', function(req, res) {

        let respuesta ="";

        if(typeof(req.body.nombre) != "undefined")
            respuesta += "Autor agregado: "+req.body.nombre + "<br>";
        else
            respuesta += "Nombre del autor no enviado en la petición";
        if(typeof(req.body.grupo) != "undefined")
            respuesta += " grupo : " + req.body.grupo + "<br>"
        else
            respuesta += "Grupo no enviado en la petición";
        if(typeof(req.body.rol) != "undefined")
            respuesta += " rol : "+ req.body.rol;
        else
            respuesta += "Rol no enviado en la petición";

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {

        });
        res.send(respuesta);
    });

    app.get('/autores/*', function(req, res) {
        res.redirect("/autores");
    });
};
