import express from 'express';

import { Post } from '../models/postModel.js';

const router = express.Router()

// create new 
router.post('/', async(req, res) => {
    try {
        const data = req.body;
        const post = {
            email: data.email,
        }
        await Post.create(post);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get all
router.get('/', async(req, res) => {
    try {
        const users = await Post.find({});
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get post with id
router.get('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// update post with id
router.put('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await Post.findByIdAndUpdate(id, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete post with id
router.delete('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await Post.findByIdAndDelete(id);
        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;