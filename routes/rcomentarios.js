module.exports = function(app, swig, gestorBD) {

    app.post("/comentarios/:cancion_id", function(req, res) {
        if ( req.session.usuario == null){
            res.send("Necesita estar en sesión para esto");
            return;
        }
        let id = req.params.id;
        let cancion_id = req.params.cancion_id;
        let criterio = { "_id" : gestorBD.mongo.ObjectID(id), "cancion_id" : gestorBD.mongo.ObjectID(cancion_id) };
        //let cancion_id = { "cancion_id" : gestorBD.mongo.ObjectID(req.params.cancion_id) };
        let comentario = {
            autor : req.session.usuario,
            texto : req.body.texto,
        }
        // Conectarse
        gestorBD.insertarComentario(criterio,comentario, function(id){
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                res.send("Agregado comentario id: "+id);
            }
        });
    });

};