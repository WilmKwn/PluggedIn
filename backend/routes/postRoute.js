import express from 'express';

import { Post } from '../models/postModel.js';

const router = express.Router()

// create new 
router.post('/', async (req, res) => {
    try {
        const post = req.body;
        await Post.create(post);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get all
router.get('/', async (req, res) => {
    try {
        const users = await Post.find({});
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get post with id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get posts with id of owner
router.get('/owner/:owner', async (req, res) => {
    try {
        const { owner } = req.params;
        const posts = await Post.find({ owner });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});


// update post with id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndUpdate(id, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete post with id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// add comment to post with id
router.post('/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { text, owner } = req.body;

    try {
        // console.log(id, text, owner)
        const post = await Post.findById(id);
        // console.log(post)
        post.comments.push({ text, owner });
        await post.save();
        return res.status(200).send('successfully added comment');
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err.message);
    }
})

router.post('/repost', async (req, res) => {
    const { id } = req.body;
    try {
        const post = await Post.findById(id);
        console.log(post)
        // await post.save();
        return res.status(200).send('successfully reposted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

export default router;