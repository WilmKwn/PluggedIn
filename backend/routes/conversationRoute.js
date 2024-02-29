import express from 'express';

import { Conversation } from '../models/conversationModel.js';

const router = express.Router()

// create new
router.post('/', async (req, res) => {
    try {
        //console.log(req.body)
        const convos = req.body;
        await Conversation.create(convos);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

//get all
router.get('/', async (req, res) => {
    try {
        console.log("getting convos")
        const convos = await Conversation.find({});
        console.log(convos);
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

// create new message in a found conversation or create a new conversation
router.post('/message', async (req, res) => {
    try {
        const { user1id, user2id, content } = req.body;
        //console.log(req.body);

        // Find the conversation based on user IDs
        let conversation = await Conversation.findOne({
            $or: [
                { user1id, user2id },
                { user1id: user2id, user2id: user1id }, // Swap IDs to handle either user1id or user2id
            ],
        });
        //console.log(conversation);
        if (conversation == null) {
            // If conversation doesn't exist, create a new one
            try {
                conversation = await Conversation.create({
                    uid: Date.now().toString(),
                    user1id,
                    user2id,
                    messages: [], // Initialize with an empty array of messages
                });
            }
            catch (error) {
                console.error("Error creating a new conversation:", error);
                return res.status(500).send("Error creating a new conversation");
            }
            console.log(conversation);
        }
        //console.log("----")
        //console.log(user1id)
        //console.log(Date().now().toString())
        //console.log(content)
        // Add the new message to the conversation
        try {
        conversation.messages.push({
            senderUid: user1id,
            sent: new Date(),
            content,
            });
        }
        catch (error) 
        {
            console.error("Error adding message:", error);
            return res.status(500).send("Error adding message");
        }
        //console.log(conversation);

        // Save the updated conversation
        await conversation.save();

        return res.status(200).send('Message sent successfully');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;