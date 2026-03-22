//Import
require('dotenv').config(); // to acces to the variable in .env file ***
const db = require('./db'); // we import the file that control the db connection
const express= require('express');
const mysql= require('mysql2');
const ejs= require('ejs');
const bodyParser= require('body-parser');
const myconnexion= require('express-myconnection');
const route= require('./routes/routesP');
const connection = require('express-myconnection');
const { connect } = require('./routes/routesP');


//option to the local server
const optionBd={
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'unyschedule_db'
}


//instanciation
const app= express();

// /////// connexion a la bd
// app.use(myconnexion(mysql, optionBd, 'pool'))

//connexion with .env data
// async function testConnection() {
//   try {
//     // On tente de récupérer les données de votre table
//     const [rows] = await db.query('SELECT * FROM departement');
    
//     console.log('✅ Connexion réussie à Railway !');
//     console.log(`Nombre de départements trouvés : ${rows.length}`);
//     console.table(rows); // Affiche vos 7 départements sous forme de tableau
    
//   } catch (error) {
//     console.error('❌ Erreur de connexion :', error.message);
//   } 
//   finally {
//     process.exit();
//   }
// }

// testConnection();


//
app.use(route); 
app.use( express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.json()); // Pour lire le JSON dans les requêtes POST ***


//database connexion

//routes
// Pas besoin de 'db' ici si tu n'interroges pas la base, 
// mais on garde la structure async pour la cohérence
app.get('/', async (req, res) => {
    try {
        res.render('index', {
            title: "Page d'accueil",
            user: null // Idéal pour gérer la connexion plus tard
        });
    } catch (err) {
        console.error("Erreur lors de l'affichage de l'accueil :", err.message);
        res.status(500).send("Erreur interne du serveur");
    }
});

app.get('/admin', async (req, res) => {
    try {
        console.log('Tentative de récupération des données...');

        // On lance toutes les requêtes en parallèle pour gagner du temps
        const [niv] = await db.query('SELECT * FROM niveau');
        const [dep] = await db.query('SELECT * FROM departement');
        const [sal] = await db.query('SELECT * FROM salle');
        const [ue]  = await db.query('SELECT * FROM ue');
        const [ens] = await db.query('SELECT * FROM enseignant');

        console.log('Success : Toutes les données ont été récupérées');

        // On envoie tout à la vue EJS
        res.status(200).render('admin', { niv, dep, sal, ue, ens });

    } catch (err) {
        // Si UNE SEULE des requêtes échoue, on tombe ici
        console.error('Erreur SQL :', err.message);
        res.status(500).send("Erreur lors du chargement du tableau de bord");
    }
});

app.get('/academic', async (req, res) => {
    try {
        console.log("Success d'adhesion - Récupération des données académiques");

        // On exécute les deux requêtes
        const [result] = await db.query('SELECT * FROM departement');
        const [resultat] = await db.query('SELECT * FROM niveau');

        // On rend la vue avec les données
        res.status(200).render('academic', { 
            dep: result, 
            niv: resultat 
        });

    } catch (err) {
        // Au lieu de "throw err" qui fait planter le serveur,
        // on log l'erreur et on prévient l'utilisateur proprement.
        console.error("Erreur lors de la récupération académique :", err.message);
        res.status(500).send("Erreur interne du serveur");
    }
});


app.get('/get_data', async (req, res) => {
    try {
        const { type, parent_value, step_id } = req.query; // On récupère tout d'un coup

        // CAS 1 : Chargement des filières (Départements) selon le Niveau
        if (type === 'load_filiere') {
            const sql = `
                SELECT d.departement 
                FROM departement d
                INNER JOIN avoir a ON a.id_departement = d.id 
                WHERE a.id_niveau = ?`;
            
            const [data] = await db.query(sql, [parent_value]);
            const data_arr = data.map(row => row.departement);
            return res.json(data_arr);
        }

        // CAS 2 : Chargement des spécialités selon le Département ET le Niveau
        if (type === 'load_specialite') {
            // 1. On trouve d'abord l'ID du département sélectionné
            const [dep_data] = await db.query('SELECT id FROM departement WHERE departement = ?', [parent_value]);
            
            if (dep_data.length === 0) return res.json([]);

            const dep_id = dep_data[0].id;

            // 2. On cherche les spécialités en utilisant l'ID du niveau (step_id) passé en paramètre
            const sqlSpec = `
                SELECT s.libelle 
                FROM specialite s
                INNER JOIN avoir a ON s.id_departement = a.id_departement
                WHERE a.id_departement = ? 
                AND a.id_niveau = ? 
                AND s.id_departement = ?`;
            
            // Note : Ici on utilise step_id qui vient de req.query
            const [data] = await db.query(sqlSpec, [dep_id, step_id, dep_id]);
            
            const data_arr = data.map(row => row.libelle);
            return res.json(data_arr);
        }

    } catch (err) {
        console.error("Erreur /get_data :", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
    }
});






//post method
app.post('/academic', async (req, res) => {
    try {
        // Extraction de toutes les données du corps de la requête
        const {
            capacity, room,
            code, name, firstname, email, tel, dep,
            departement,
            libelle, check, effectif,
            code_ue, lib, dep_ue, niv, filiere, ue_spec,
            speciality, spec_dep, niv_spec
        } = req.body;

        // 1. ENREGISTREMENT D'UNE SALLE
        if (room && capacity) {
            const [existing] = await db.query('SELECT nom FROM salle WHERE nom = ?', [room]);
            if (existing.length > 0) return res.render('reponse', { result: 'Salle déjà existante' });
            if (capacity <= 0) return res.render('reponse', { result: 'La capacité doit être sup à zéro' });

            await db.query('INSERT INTO salle (nom, capacite) VALUES (?,?)', [room, capacity]);
            return res.render('reponse', { result: 'Salle enregistrée' });
        }

        // 2. ENREGISTREMENT D'UN NIVEAU (Et ses effectifs par département)
        if (libelle) {
            const [existing] = await db.query('SELECT libelle FROM niveau WHERE libelle = ?', [libelle]);
            if (existing.length > 0) return res.render('reponse', { result: 'Niveau déjà existant' });

            const [result] = await db.query('INSERT INTO niveau (libelle) VALUES (?)', [libelle]);
            const newNiveauId = result.insertId;

            if (check && effectif) {
                const checks = Array.isArray(check) ? check : [check];
                const effectifs = Array.isArray(effectif) ? effectif : [effectif];

                for (let i = 0; i < checks.length; i++) {
                    await db.query('INSERT INTO avoir (id_departement, id_niveau, effectif) VALUES(?,?,?)', 
                        [checks[i], newNiveauId, effectifs[i]]);
                }
            }
            return res.render('reponse', { result: 'Niveau enregistré' });
        }

        // 3. ENREGISTREMENT D'UN DEPARTEMENT
        if (departement) {
            const [existing] = await db.query('SELECT departement FROM departement WHERE departement = ?', [departement]);
            if (existing.length > 0) return res.render('reponse', { result: 'Département déjà existant' });

            await db.query('INSERT INTO departement (departement) VALUES (?)', [departement]);
            return res.render('reponse', { result: 'Département enregistré' });
        }

        // 4. ENREGISTREMENT D'UNE UE
        if (code_ue && lib) {
            const [existing] = await db.query('SELECT id FROM ue WHERE id = ?', [code_ue]);
            if (existing.length > 0) return res.render('reponse', { result: 'UE déjà existante' });

            // On insère l'UE
            await db.query('INSERT INTO ue (id, libelle, id_departement_responsable, id_niveau) VALUES (?,?,?,?)', 
                [code_ue, lib, dep_ue, niv]);

            // On gère les spécialités associées (dispenser)
            if (ue_spec && filiere) {
                const [dep_data] = await db.query('SELECT id FROM departement WHERE departement = ?', [filiere]);
                const specs = Array.isArray(ue_spec) ? ue_spec : [ue_spec];

                for (let spec_lib of specs) {
                    const [spec_data] = await db.query('SELECT id FROM specialite WHERE libelle = ? AND id_departement = ?', 
                        [spec_lib, dep_data[0].id]);
                    if (spec_data.length > 0) {
                        await db.query('INSERT INTO dispenser (id_specialite, id_ue) VALUES (?,?)', [spec_data[0].id, code_ue]);
                    }
                }
            }
            return res.render('reponse', { result: 'UE enregistrée avec succès' });
        }

        // 5. ENREGISTREMENT D'UNE SPECIALITE
        if (speciality && spec_dep) {
            const [dep_data] = await db.query('SELECT id FROM departement WHERE departement = ?', [spec_dep]);
            const [existing] = await db.query('SELECT id FROM specialite WHERE libelle = ? AND id_departement = ?', 
                [speciality, dep_data[0].id]);

            if (existing.length > 0) return res.render('reponse', { result: 'Spécialité déjà existante' });

            const [result] = await db.query('INSERT INTO specialite (libelle, id_departement) VALUES(?,?)', 
                [speciality, dep_data[0].id]);
            const newSpecId = result.insertId;

            if (niv_spec) {
                const nivs = Array.isArray(niv_spec) ? niv_spec : [niv_spec];
                for (let n_id of nivs) {
                    await db.query('INSERT INTO apparaitre (id_specialite, id_niveau) VALUES(?,?)', [newSpecId, n_id]);
                }
            }
            return res.render('reponse', { result: 'Spécialité enregistrée' });
        }

        // 6. ENREGISTREMENT D'UN ENSEIGNANT
        if (code && name) {
            const [existing] = await db.query('SELECT id FROM enseignant WHERE id = ?', [code]);
            if (existing.length > 0) return res.render('reponse', { result: 'L\'enseignant existe déjà' });

            const [dep_data] = await db.query('SELECT id FROM departement WHERE departement = ?', [dep]);
            await db.query('INSERT INTO enseignant (id, nom, prenom, telephone, e_mail, id_departement) VALUES(?,?,?,?,?,?)', 
                [code, name, firstname, tel, email, dep_data[0].id]);
            
            return res.render('reponse', { result: 'Enseignant enregistré' });
        }

    } catch (err) {
        console.error("Erreur critique :", err);
        res.status(500).render('reponse', { result: "Erreur lors de l'enregistrement : " + err.message });
    }
});





/**************************conception de l'emploi de temps******************/
/***************************************************************************/

app.get('/timetable', async (req, res) => {
    try {
        // 1. On vérifie d'abord l'ID du département spécial
        const sqlCheck = `
            SELECT s.id_departement 
            FROM specialite s
            JOIN dispenser d ON s.id = d.id_specialite
            JOIN passer p ON d.id_ue = p.id_ue 
            LIMIT 1`;
        
        const [res_id] = await db.query(sqlCheck);

        // Si on a un ID spécifique, on filtre les départements, sinon on prend tout
        let dep;
        if (res_id.length !== 0) {
            const [rows] = await db.query('SELECT departement, id FROM departement WHERE id <> ?', [res_id[0].id_departement]);
            dep = rows;
            // Dans ce cas précis de ton code original, tu ne renvoyais que 'dep'. 
            // Si c'est l'intention, on s'arrête ici :
            return res.render('timetable', { dep });
        }

        // 2. Si res_id est vide, on charge TOUTES les données pour l'emploi du temps
        // On utilise Promise.all pour lancer toutes les requêtes en même temps (gain de performance)
        const [
            [depList],
            [nivList],
            [specList],
            [ueList],
            [jourList],
            [salleList],
            [enseignantList]
        ] = await Promise.all([
            db.query('SELECT departement, id FROM departement'),
            db.query('SELECT n.id, n.libelle, a.id_departement AS id_dep FROM niveau n JOIN avoir a ON n.id = a.id_niveau'),
            db.query('SELECT DISTINCT s.id, s.id_departement AS id_ds, s.libelle, ap.id_niveau AS id_niv FROM specialite s JOIN apparaitre ap ON s.id = ap.id_specialite'),
            db.query('SELECT u.id, d.id_specialite AS id_spec, u.id_niveau AS id_nu FROM ue u JOIN dispenser d ON u.id = d.id_ue'),
            db.query('SELECT jour, id FROM jour'),
            db.query('SELECT nom, id FROM salle'),
            db.query('SELECT DISTINCT e.id, e.nom FROM enseignant e JOIN ue u ON e.id_departement = u.id_departement_responsable')
        ]);

        console.log('Chargement complet terminé');

        // 3. On envoie tout à la vue
        res.render('timetable', {
            dep: depList,
            niv: nivList,
            spec: specList,
            ue: ueList,
            jour: jourList,
            salle: salleList,
            enseignant: enseignantList
        });

    } catch (err) {
        console.error("Erreur Timetable :", err.message);
        res.status(500).render('erreur', { err });
    }
});



app.get('/get_horaire_data', async (req, res) => {
    try {
        // Correction des variables : parent1=enseignant, parent2=salle, parent3=jour
        const { parent1, parent2, parent3 } = req.query;

        console.log(`Recherche horaires pour : Enseignant ${parent1}, Salle ${parent2}, Jour ${parent3}`);

        // 1. On cherche si cet enseignant a déjà un cours ce jour-là dans cette salle
        const sqlCheck = 'SELECT id_heure FROM passer WHERE id_jour = ? AND id_salle = ? AND id_enseignant = ?';
        const [existingAppointments] = await db.query(sqlCheck, [parent3, parent2, parent1]);

        let sqlHeure;
        let paramsHeure = [];

        if (existingAppointments.length === 0) {
            // CAS : Aucune contrainte, on récupère toutes les heures
            sqlHeure = 'SELECT description FROM heure';
        } else {
            // CAS : On exclut les heures déjà prises (pour éviter les doublons)
            // On récupère les IDs des heures occupées
            const busyHourIds = existingAppointments.map(row => row.id_heure);
            sqlHeure = 'SELECT description FROM heure WHERE id NOT IN (?)';
            paramsHeure = [busyHourIds];
        }

        const [hours] = await db.query(sqlHeure, paramsHeure);
        
        // On transforme le résultat en tableau simple de descriptions
        const data_arr = hours.map(row => row.description);
        
        res.json(data_arr);

    } catch (err) {
        console.error("Erreur /get_horaire_data :", err.message);
        res.status(500).json({ error: "Erreur lors du chargement des horaires" });
    }
});


//methode post



//launch server
app.listen(3000, () => {'Server understand'})