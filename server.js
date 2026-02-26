//Import
const express= require('express');
const mysql= require('mysql2');
const ejs= require('ejs');
const bodyParser= require('body-parser');
const myconnexion= require('express-myconnection');
const route= require('./routes/routesP');
const connection = require('express-myconnection');
const { connect } = require('./routes/routesP');

const optionBd={
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'unyschedule_db'
}

//instanciation
const app= express();

/////// connexion a la bd
app.use(myconnexion(mysql, optionBd, 'pool'))
//
app.use(route); 
app.use( express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');


//database connexion

//routes
app.get('/', (req, res) => {
    res.render( 'index',{
        title: 'Page d\'accueil',
        user: null
    });
});

app.get('/admin', (req, res) => {
    req.getConnection((err, connection)=> {
        if(err){
            console.log(err)
        }else{
            console.log('Success')
            connection.query('SELECT * FROM niveau', [], (err, niv)=> {
                if(err){
                    console.log(err)
                }else{
                    connection.query('SELECT * FROM departement', [], (err, dep)=> {
                        if(err){
                            console.log(err)
                        }else{
                            connection.query('SELECT * FROM salle', [], (err, sal)=> {
                                if(err){
                                    console.log(err)
                                }else{
                                    connection.query('SELECT * FROM ue', [], (err, ue)=> {
                                        if(err){
                                            console.log(err)
                                        }else{
                                            connection.query('SELECT * FROM enseignant', [], (err, ens)=> {
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    res.status(200).render('admin', {niv, dep, sal, ue, ens});
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.get('/academic', (req, res, next) => {
    req.getConnection((err, connection)=> {
        if(err){
            console.log(err)
        }else{
            console.log('Success d\'adhesion')
            connection.query('SELECT * FROM departement', [], (err, result)=> {
                if(err) throw err
                connection.query('SELECT * FROM niveau', [], (err, resultat)=> {
                    if(err) throw err
                    res.status(200).render('academic', {dep: result, niv: resultat});
                })
            })
        }
    })
})



var step_id;
app.get('/get_data', (req, res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            console.log('.........')
            var type= req.query.type;
            var search_query= req.query.parent_value;
            if(type== 'load_filiere'){
                step_id= search_query
                connection.query('SELECT departement.departement FROM departement, avoir WHERE avoir.id_departement=departement.id AND avoir.id_niveau=?',[search_query], (err,data)=>{
                    if(err){
                        console.log(err)
                    }else{
                        var data_arr=[];
                        data.forEach(function(row){
                            data_arr.push(row.departement);
                        })
                        res.json(data_arr,);
                    }
                })
            }
            if(type== 'load_specialite'){
                connection.query('SELECT id FROM departement WHERE departement=?', [search_query], (err, dep_id)=>{
                  
                    if(err){
                        console.log(err)
                    }else{
                        connection.query('SELECT specialite.libelle FROM specialite, avoir WHERE avoir.id_departement=? AND avoir.id_niveau=? AND specialite.id_departement=?',[dep_id[0].id, step_id, dep_id[0].id], (err, data)=>{
                            if(err){
                                console.log(err)
                            }else{
                                var data_arr=[];
                                data.forEach(function(row){
                                    data_arr.push(row.libelle);
                                })
                                res.json(data_arr,);
                            }
                        })
                    }
                })
            }
            
        }
    })
   
})






//post method
app.post('/academic', (req, res) =>{
    //salle
        var capacity= req.body.capacity,
            room= req.body.room,
            appartient=req.body.appartient;
    //enseigenat
        var code= req.body.code,
            name= req.body.name,
            firstname=req.body.firstname,
            email= req.body.email,
            tel= req.body.tel,
            dep=req.body.dep;
    //departement
       var departement= req.body.departement;
    //niveau
      var   libelle= req.body.libelle,
            check=req.body.check,
            effectif= req.body.effectif;
    //ue
        var code_ue=req.body.code_ue,
            lib= req.body.lib,
            dep_ue=req.body.dep_ue,
            niv= req.body.niv,
            filiere=req.body.filiere,
            ue_spec=req.body.ue_spec;;
    //specialite
        var speciality=req.body.speciality,
            spec_dep= req.body.spec_dep,
            niv_spec= req.body.niv_spec,
            code_spec=req.body.code_spec;
    
        req.getConnection((err, connection)=> {
            if(err){
                console.log(err)
                console.log('erreur 1')
            }else{
                console.log('Success')
                console.log('succes 1')
    
                //enregistrement d'une salle
                if(room && capacity){
                    connection.query('SELECT nom FROM salle WHERE nom = ?', [room], (error, result)=>{
                        if(error){
                            console.log(error);
                            console.log('erreur 2')
                        }else{
                            if(result.length==0){
                                if(capacity>0){
                                    connection.query('INSERT INTO salle (id, nom, capacite) VALUES (?,?,?)', [null, room, capacity], (err, result)=> {
                                        if(err){
                                            console.log(err)
                                            console.log('erreur 3')
                                        }else{
                                            console.log('salle enregistree')
                                            return res.render('reponse', {result: 'Salle enregistree'});
                                            
                                        }
                                    })
                                }else{
                                    console.log('la capacite doit etre sup a zero')
                                    return res.render('reponse', {result: 'la capacite doit etre sup a zero'});
                                }
                            }else{
                                console.log('salle deja existente')
                                return res.render('reponse', {result: 'Salle deja existente'});
                                
                            }
                        }
                    } )
                }
                
                //Enregistrement du niveau
                if(libelle){
                    for(var i=0; i<check.length; i++){ 
                        console.log(check[i]);
                        console.log(effectif[i]);
                    }
                  
                    connection.query('SELECT libelle FROM niveau WHERE libelle = ?', [libelle], (error, result)=>{
                        if(error){
                            console.log(error);
                            res.status().render('erreur', {error})
                        }else{
                            if(result.length==0){
                                connection.query('INSERT INTO niveau (id, libelle) VALUES (?,?)', [null, libelle], (err, result)=> {
                                    if(err){
                                        console.log(err)
                                        res.status().render('erreur', {err})
                                    }else{
                                        connection.query('SELECT id FROM niveau WHERE libelle=?', [libelle], (err, id)=>{
                                            if(err){
                                                console.log(err);
                                                res.status().render('erreur', {err})
                                            }else{
                                                for(var i=0; i<check.length; i++){
                                                    connection.query('INSERT INTO avoir (id_departement, id_niveau, effectif) VALUES(?,?,?)', [check[i], id[0].id, effectif[i]], (err, result)=>{
                                                        if(err){
                                                            console.log(err)
                                                            res.status().render('erreur', {err})
                                                        }else{
                                                            console.log('tout marche')
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                        console.log('niveau enregistree')
                                        return res.render('reponse', {result: 'niveau enregistree'});
                                    }
                                })
                            }else{
                                console.log('niveau deja existente')
                                return res.render('reponse', {result: 'niveau deja existente'});
                                
                            }
                        }
                    } )
                }

                //Enregistrement d'un departement
                if(departement){
                    connection.query('SELECT departement  FROM departement  WHERE departement= ?', [departement], (error,result)=>{
                        if(err){
                            console.log('error')
                        }else{
                            if(result.length==0){
                                connection.query('INSERT INTO departement (id, departement) VALUES (?,?)', [null, departement], (err, result)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        console.log('departement enregistre')
                                        return res.render('reponse', {result: 'departement enregistre'})
                                    }
                                })
                            }else{
                                console.log('departement deja existant')
                                return res.render('reponse', {result: 'departement deja existant'})
                            }
                        }
                    })
                }

                //Enregistrement d'une UE
                if(lib && niv && dep_ue && code_ue && filiere && ue_spec){
                    connection.query('SELECT id FROM ue WHERE id=?', [code_ue], (err, result)=>{
                        if(err){
                            console.log(err);
                            res.status().render('erreur', {err});
                        }else{
                            if(result.length==0){
                                connection.query('SELECT id FROM departement WHERE departement=?', [filiere], (err, dep_id)=>{
                                    if(err){
                                        console.log(err)
                                        res.status().render('erreur', {err});
                                    }else{
                                       if(Array.isArray(ue_spec)){
                                            for(var i=0; i<ue_spec.length; i++){
                                                connection.query('SELECT id FROM specialite WHERE  libelle=? AND id_departement=?',[ue_spec[i] ,dep_id[0].id], (err, idSpec)=>{
                                                    if(err){
                                                        console.log(err);
                                                        res.status().render('erreur', {err})
                                                    }else{
                                                        connection.query('INSERT INTO dispenser (id_specialite, id_ue) VALUES (?,?)',[idSpec[0].id, code_ue], (err, result)=>{
                                                            if(err){
                                                                console.log(err)
                                                                res.status().render('erreur', {err});
                                                            }else{
                                                                console.log('enregistrement dans la table: dispenser')
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                       }else{
                                            connection.query('SELECT id FROM specialite WHERE  libelle=? AND id_departement=?',[ue_spec ,dep_id[0].id], (err, idSpec)=>{
                                                if(err){
                                                    console.log(err);
                                                    res.status().render('erreur', {err})
                                                }else{
                                                    connection.query('INSERT INTO dispenser (id_specialite, id_ue) VALUES (?,?)',[idSpec[0].id, code_ue], (err, result)=>{
                                                        if(err){
                                                            console.log(err)
                                                            res.status().render('erreur', {err});
                                                        }else{
                                                            console.log('enregistrement dans la table: dispenser')
                                                        }
                                                    })
                                                }
                                            })
                                        
                                       }
                                       connection.query('INSERT INTO ue (id, libelle, id_departement_responsable, id_niveau) VALUES (?,?,?,?)', [code_ue, lib, dep_ue, niv], (err, result)=>{
                                        if(err){
                                            console.log(err);
                                            res.status().render('erreur', {err});
                                        }else{
                                            console.log('ue enregistree avec succes')
                                            res.status(200).render('reponse', {result: 'ue enregistre avec success'})
                                        }
                                       })
                                    }
                                })
                            }else{
                                console.log('ue deja existante');       
                                res.status().render('reponse', {result: 'ue deja existante'})
                            }
                        }
                    })
                }

                //Enregistrement d'une specialite 
                if( speciality && spec_dep && niv_spec){
                    connection.query('SELECT id FROM departement WHERE departement= ?', [spec_dep], (err, idDepartement)=>{
                        if(err) throw err
                        connection.query('SELECT libelle, id_departement FROM specialite WHERE libelle=? AND id_departement=?', [speciality, idDepartement[0].id], (err, result)=>{
                           if(err){
                            console.log(err)
                            res.status().render('erreur', {err})
                           }else{
                               if(result.length==0){
                                    connection.query('INSERT INTO specialite (id, libelle, id_departement) VALUES(?,?,?)', [null, speciality, idDepartement[0].id], (err, result)=>{
                                        if(err){
                                            console.log(err);
                                            res.status().render('erreur', {err})
                                        }else{
                                            connection.query('SELECT id FROM specialite WHERE libelle=?', [speciality], (err, id)=>{
                                                if(err){
                                                    console.log(err)
                                                    res.status().render('erreur', {err})
                                                }else{
                                                    for(var i=0; i<niv_spec.length; i++){
                                                        connection.query('INSERT INTO apparaitre (id_specialite, id_niveau) VALUES(?,?)', [id[0].id, niv_spec[i]], (err, result)=>{
                                                            if(err){
                                                                console.log(err);
                                                                res.status().render('erreur', {err})
                                                            }else{
                                                                console.log('alles klar')
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                            console.log('Specialite enregistree')
                                            res.status(200).render('reponse', {result: 'enregistrement reussi'})
                                        }
                                    })
                               }else{
                                res.status(200).render('reponse', {result: 'specialite deja existante'})
                               }
                           }
                        })
                    })
                }

                //Enregistrement d'un enseignant
                if(code && name && firstname && email && tel && dep){
                    connection.query('SELECT id FROM enseignant WHERE id= ?', [code], (err, result)=>{
                        if(err){
                            console.log(err)
                            return res.status().render('erreur', {err})
                        }else{
                            if(result.length==0){
                                connection.query('SELECT id FROM departement WHERE departement= ?', [dep], (err, idDepartement)=>{
                                    if(err) throw err
                                    connection.query('INSERT INTO enseignant (id, nom, prenom, telephone, e_mail, id_departement) VALUES(?,?,?,?,?,?)', [code, name, firstname, tel, email, idDepartement[0].id], (err, result)=>{
                                        if(err){
                                            console.log(err)
                                        }else{
                                            console.log('enseignant enregistre')
                                            return res.status(200).render('reponse', {result: 'enseignant enregistre'})
                                        }
                                       
                                    })
                                })
                            }else{
                                console.log('Lenseignant existe deja')
                            return res.status(200).render('reponse', {result: 'Lenseignant existe deja'})
                            }
                        }                        
                    })
                }
                
                
                
            }
        })
    
})





/**************************conception de l'emploi de temps******************/
/***************************************************************************/
app.get('/timetable', (req, res)=>{
    req.getConnection((err, connection)=>{
        if(err){
            console.log(err);
            res.status().render('erreur', {err});
        }else{
            connection.query('SELECT specialite.id_departement FROM specialite, passer, dispenser WHERE passer.id_ue=dispenser.id_ue AND dispenser.id_specialite=specialite.id', [], (err, res_id)=>{
                if(err){
                    console.log(err);
                    res.status().render('erreur', {err})
                }else{
                    if(res_id.length!=0){
                        connection.query('SELECT departement, id FROM departenment WHERE id<>?', [res_id[0].id], (err, dep)=>{
                            if(err){
                                console.log(err);
                                res.status().render('erreur', {err}) 
                            }else{
                                console.log('extraction1')
                                res.render('timetable', {dep})
                            }
                        })
                    }else{
                        connection.query('SELECT departement, id FROM departement', [], (err, dep)=>{
                            if(err){
                                console.log(err);
                                res.status().render('erreur', {err})
                            }else{
                                console.log('extraction')
                                console.log(dep)
                                console.log(dep[0].departement)
                                //selection des niveau
                                connection.query('SELECT niveau.id AS id, niveau.libelle AS libelle, avoir.id_departement AS id_dep  FROM niveau, avoir WHERE niveau.id=avoir.id_niveau', [], (err, niv)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log('**niveau**')
                                        console.log(niv)
                                        console.log(niv[0].id)
                                        console.log(niv[0].libelle)
                                        console.log(niv[0].id_dep)
                                        //selection des specialite
                                        connection.query('SELECT DISTINCT specialite.id AS id, specialite.id_departement AS id_ds, specialite.libelle AS libelle, apparaitre.id_niveau AS id_niv  FROM specialite, apparaitre WHERE specialite.id=apparaitre.id_specialite', [], (err, spec)=>{
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log('**specialite**')
                                                console.log(spec)
                                                console.log(spec[0].id)
                                                console.log(spec[0].libelle)
                                                console.log(spec[0].id_niv)
                                                console.log(spec[0].id_ds)
                                                connection.query('SELECT ue.id AS id, dispenser.id_specialite AS id_spec, ue.id_niveau AS id_nu  FROM ue, dispenser WHERE ue.id=dispenser.id_ue', [], (err, ue)=>{
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        console.log('**ue**')
                                                        console.log(ue)
                                                        console.log(ue[0].id)
                                                        console.log(ue[0].id_nu)
                                                        console.log('chargement termine')
                                                        connection.query('SELECT jour, id FROM jour',[], (err,jour)=>{
                                                            if(err){
                                                                console.log(err)
                                                                res.status().render('erreur',{err})
                                                            }else{
                                                                console.log('****jour****')
                                                                console.log(jour)
                                                                connection.query('SELECT nom, id FROM salle',[], (err,salle)=>{
                                                                    if(err){
                                                                        console.log(err)
                                                                        res.status().render('erreur',{err})
                                                                    }else{
                                                                        console.log('****salle****')
                                                                        console.log(salle)
                                                                        connection.query('SELECT DISTINCT enseignant.id AS id, nom FROM enseignant, ue WHERE enseignant.id_departement=ue.id_departement_responsable ',[], (err,enseignant)=>{
                                                                            if(err){
                                                                                console.log(err)
                                                                                res.status().render('erreur',{err})
                                                                            }else{
                                                                                console.log('****enseignant****')
                                                                                console.log(enseignant)
                                                                                res.render('timetable', {dep, niv, spec, ue, enseignant, jour, salle})
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                
                            }
                        })

                    }
                    
                }
            })

        }
    })
})



app.get('/get_horaire_data', (req, res)=>{
    req.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }else{
            console.log('.........')
            var parent1= req.query.parent1,
                parent2= req.query.parent2,
                parent3= req.query.parent2;
                connection.query('SELECT id_heure AS id FROM passer WHERE id_jour=? AND id_salle=? AND id_enseignant=?', [parent3, parent2 ,parent1], (err, r1)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(r1)
                        if(r1.length==0){
                            connection.query('SELECT description FROM heure?',[], (err, data)=>{
                                if(err){
                                    console.log(err)
                                    
                                }else{
                                    console.log(data)
                                    var data_arr=[];
                                    data.forEach(function(row){
                                        data_arr.push(row.description);
                                    })
                                    res.json(data_arr,);
                                }
                            })
                        }else{
                            connection.query('SELECT description FROM heure WHERE id<>?',[r1[0].id], (err, data)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log(data)
                                    var data_arr=[];
                                    data.forEach(function(row){
                                        data_arr.push(row.description);
                                    })
                                    res.json(data_arr,);
                                }
                            })

                        }
                    }
                })
            
        }
    })
   
})








//methode post




//launch server
app.listen(3000, () => {'Server understand'})