const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/addContacto', isLoggedIn, async(req, res) => {
    const links = await pool.query('SELECT * FROM usersdata');
    res.render('links/contactos', { links });
});

router.post('/addContacto', isLoggedIn, async (req, res) => {
    const { nombre, telefono, correo, pais, ciudad, direccion } = req.body;
    const newLink = {
      nombre,
      telefono,
      correo,
      pais,
      ciudad,
      direccion
    };
    await pool.query('INSERT INTO usersdata SET ?', [newLink]);
    const links = await pool.query('SELECT * FROM usersdata');
    res.render('links/contactos', { links });
  });  

router.get('/contactos', isLoggedIn, async (req, res) => {
  const links = await pool.query('SELECT * FROM usersdata');
  res.render('links/contactos', { links });
});

//

router.get('/deleteContacto/:id', isLoggedIn, async (req, res) => { 
    const{ id } = req.params;
    await pool.query('DELETE FROM usersdata WHERE id = ?', [id]);
    req.flash('success', 'Usuario Removido correctamente');
    res.redirect('/contactos/addContacto');
});
 
//Actualizar
router.get('/editContacto/:id', isLoggedIn, async (req, res) => {
    const{ id } = req.params;
    const contacto = await pool.query('SELECT * FROM usersdata WHERE id = ?', [id]);
    console.log(contacto)

    //Crea variable que asigna todo lo que está en la consula (select * from)
    res.render('links/editContactos', {contacto: contacto[0]});
});

//Datos para actualizar
router.post('/editContacto/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo, pais, ciudad, direccion } = req.body;
    const newLink = {
      nombre,
      telefono,
      correo,
      pais,
      ciudad,
      direccion
    };
    await pool.query('UPDATE usersdata set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Usuario actualizado correctamente');
    res.redirect('/contactos/addContacto');
});

module.exports = router;