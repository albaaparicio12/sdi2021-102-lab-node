module.exports = function(app, gestorBD) {


    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        validarCancionNueva(cancion, function(errores){
            if(errores !== null && errores.length > 0){
                res.status(403); //Forbidden
                res.json({
                    errores: errores
                })
            } else{
                gestorBD.insertarCancion(cancion, function(id){
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "canción insertada",
                            _id : id
                        })
                    }
                });
            }
        })
    });

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let cancionId = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = req.session.usuario;
        let criterio = {"_id": cancionId};

        validarAutorCancion(usuario, cancionId, function (errores) {
            if (errores !== null && errores.length > 0) {
                res.status(403); //Forbidden
                res.json({
                    errores: errores
                })
            } else {
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));
                    }
                });
            }
        });
    });

    app.put("/api/cancion/:id", function(req, res) {

        let cancionId = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = req.session.usuario;
        let criterio = { "_id" : cancionId};

        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio:  req.body.precio
        }; // Solo los atributos a modificar
        validarAutorCancion(usuario, cancionId, function(errores){
            if(errores !== null && errores.length > 0){
                res.status(403); //Forbidden
                res.json({
                    errores: errores
                })
            } else{
                validarCancionActualizada(cancion,function(errores){
                    if(errores !== null && errores.length > 0){
                        res.status(403); //Forbidden
                        res.json({
                            errores: errores
                        })
                    } else{
                        gestorBD.modificarCancion(criterio, cancion, function(result) {
                            if (result == null) {
                                res.status(500);
                                res.json({
                                    error : "se ha producido un error"
                                })
                            } else {
                                res.status(200);
                                res.json({
                                    mensaje : "canción modificada",
                                    _id : req.params.id
                                })
                            }
                        });
                    }
                });
            }
        })
    });

    app.post("/api/autenticar", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256',app.get('clave'))
                .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios){
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); //Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }
        });

    });

    function validarCancionNueva(cancion, functionCallback){
        let errores = new Array();
        if(cancion.nombre == null || typeof cancion.nombre === 'undefined' || cancion.nombre.length <3)
            errores.push("Error en el nombre de la canción: la longitud debe ser mayor o igual que 3.");
        if(cancion.genero == null || typeof cancion.genero === 'undefined' || cancion.genero.length <3)
            errores.push("Error en el género de la canción: la longitud debe ser mayor o igual que 3.");
        if(cancion.precio == null || cancion.precio <= 0 || typeof cancion.precio === 'undefined' )
            errores.push("Error en el precio de la canción: el precio debe ser mayor que 0.");

        functionCallback(errores);
    }

    function validarCancionActualizada(cancion, funcionCallback){
        let errores = new Array();
        if(cancion.nombre == null || typeof cancion.nombre === 'undefined' || cancion.nombre.length <3)
            errores.push("Error en el nombre de la canción: la longitud debe ser mayor o igual que 3.");
        if(cancion.genero == null || typeof cancion.genero === 'undefined' || cancion.genero.length <3)
            errores.push("Error en el género de la canción: la longitud debe ser mayor o igual que 3.");
        if(cancion.precio == null || cancion.precio <= 0 || typeof cancion.precio === 'undefined' )
            errores.push("Error en el precio de la canción: el precio debe ser mayor que 0.");

        functionCallback(errores);
    }

    function validarAutorCancion(usuario, cancionId, functionCallback){
        let errores = new Array();
        let criterio_esAutor = {$and: [{"_id": cancionId}, {"autor": usuario}]};
        gestorBD.obtenerCanciones(criterio_esAutor,function(canciones){
            if(canciones == null || canciones.length > 0){
                errores.push("Error: debe ser el autor de la canción para modificarla o borrarla.");
            }
            functionCallback(errores);
        });
    }
}
