import express from 'express';

import { Song } from '../models/songModel.js';

const router = express.Router();

// create new 
router.post('/', async (req, res) => {
    try {
        const song = req.body;
        await Song.create(song);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get all
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find({});
        return res.status(200).json(songs);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get song with id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);
        return res.status(200).json(song);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get songs with id of owner
router.get('/owner/:owner', async (req, res) => {
    try {
        const { owner } = req.params;
        const songs = await Song.find({ owner });
        return res.status(200).json(songs);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});


// update song with id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Song.findByIdAndUpdate(id, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete post with id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Song.findByIdAndDelete(id);
        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;