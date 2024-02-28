import express from 'express';

import { Conversation } from '../models/conversationModel.js';

const router = express.Router()

// create new
router.post('/', async(req, res) => {
    try {
        console.log(req.body)
        const convo = req.body;
        await Conversation.create(convo);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

//get all
router.get('/', async (req,res) => {
    try {
        const convos = await Conversation.find({});
        return res.status(200).json(convos);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get convo with id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const convo = await Conversation.findById(id);
        return res.status(200).json(convo);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

//update convo with id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Conversation.findByIdAndUpdate(id, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete convo with id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Conversation.findByIdAndDelete(id);
        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;