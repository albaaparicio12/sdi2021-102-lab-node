module.exports = function(app, swig, gestorBD) {

    app.post("/comentarios/:cancion_id", function(req, res) {
        if ( req.session.usuario == null){
            res.send("Necesita estar en sesión para esto");
            return;
        }

        let comentario = {
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id),
            autor : req.session.usuario,
            texto : req.body.texto,
        }
        // Conectarse
        gestorBD.insertarComentario(comentario, function(id){
            if (id == null) {
                res.send("Error al insertar ");
            } else {
                res.redirect("/cancion/"+req.params.cancion_id);
            }
        });
    });

    app.get("/comentario/borrar/:_id", function(req,res){
       if(req.session.usuario == null) {
           res.send("Necesita estar en sesión para esto");
           return;
       }

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.borrarComentario(criterio, function(comentarios){
            if (comentarios == null) {
                res.send("Error al borrar comentario ");
            } else {
                //res.redirect("/cancion/"+req.params.cancion_id);
                res.send("Comentario eliminado");
            }
        });
    });

};