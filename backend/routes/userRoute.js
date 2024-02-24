import express from 'express';

import { User } from '../models/userModel.js';

import { ObjectId } from 'mongodb';

const router = express.Router()

// create new 
router.post('/', async(req, res) => {
    try {
        await User.create(req.body);
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
        const query = {
            uid: id,
        }
        const user = await User.findOne({uid: id});
        if (user === null) {
            return res.status(500).send("null");
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.get('/:id/info', async(req, res) => {
       const userId = req.params.id;
    try {
        // Find the user by uid
        const user = await User.findOne({ uid: userId });

        // If user found, return user data
        if (user) {
            console.log('User found:', user);
            return res.status(200).json(user);
        } else {
            console.log('User not found');
            return res.status(500).send("null");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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