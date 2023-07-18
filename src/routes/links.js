const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async(req, res) => {
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
    };
    await pool.query('INSERT INTO link set ?', [newLink])
    res.redirect('/links');
});

router.get('/', isLoggedIn, async(req, res) => {
    const links = await pool.query('SELECT * FROM link');
    console.log(links)
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async(req, res) => {
    const{ id } = req.params;
    await pool.query('DELETE FROM link WHERE ID = ?', [id]);
    req.flash('success', 'Enlace removido satisfactoriamente')
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query ('SELECT * FROM link WHERE id = ?', [id])
    res.render('links/edit', { links: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE link set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link guardado correctamente');
    res.redirect('/links');
});

module.exports = router;