import express from 'express';

import { User } from '../models/userModel.js';

const router = express.Router()

// create new 
router.post('/', async(req, res) => {
    try {
        const data = req.body;
        const user = {
            email: data.email,
            username: data.username,
            password: data.password,
            accountType: data.accountType,
        }
        await User.create(user);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get all
router.get('/', async(req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get user with id
router.get('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// update user with id
router.put('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await User.findByIdAndUpdate(id, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete user with id
router.delete('/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;