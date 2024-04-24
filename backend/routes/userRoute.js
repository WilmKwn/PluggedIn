import express from 'express';

import { User } from '../models/userModel.js';

import { deleteUserActivity } from '../multiFunctions/deleteUserActivity.js';

const router = express.Router()

// create new 
router.post('/', async (req, res) => {
    try {
        await User.create(req.body);
        return res.status(200).send('successfully created');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// get user with id
router.get('/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const query = {
            uid: id,
        }
        const user = await User.findOne({ uid: id });
        if (user === null) {
            return res.status(500).send("null");
        }
        return res.status(200).json(user);
    } catch (err) {
        console.log("error" + err.message)
        return res.status(404).send(err.message);
    }
});

router.get('/:id/info', async (req, res) => {
    const userId = req.params.id;
    try {
        // Find the user by uid
        const user = await User.findOne({ uid: userId });

        // If user found, return user data
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(500).send("null");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).send(err.message);
    }


});

// update user with id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ uid: id });
        await User.findOneAndUpdate(user, req.body);
        return res.status(200).send('successfully updated');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete user with id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = {
            uid: id,
        }
        const user = await User.findOne({ uid: id });
        if (user === null) {
            return res.status(500).send("null");
        }
        // await User.findOneAndDelete(query);
        await deleteUserActivity(query);


        return res.status(200).send('successfully deleted');
    } catch (err) {
        return res.status(500).send(err.message);
    }
});


// add skill to user
router.post('/:id/skills', async (req, res) => {
    try {
        const { id } = req.params;
        const { skill } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add the skill
        if (user) {
            user.skills.push(skill);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// add hashtag to user
router.post('/:id/hashtags', async (req, res) => {
    try {
        const { id } = req.params;
        const { hashtag } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add the skill
        if (user) {
            if (!user.hashtags) {
                user.hashtags = [];
            }
            user.hashtags.push(hashtag);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// add friend to user
router.post('/:id/friends', async (req, res) => {
    try {
        const { id } = req.params;
        const { friend } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add the skill
        if (user) {
            user.friends.push(friend);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// add to user's blockedUsers
router.post('/:id/blockedUsers', async (req, res) => {
    try {
        const { id } = req.params;
        const { blockee } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add the skill
        if (user) {
            user.blockedUsers.push(blockee);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// add to user's joinedRecordLabels
router.post('/:id/joinedLabels', async (req, res) => {
    try {
        const { id } = req.params;
        const { labelId } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add the label
        if (user) {
            user.joinedRecordLabels.push(labelId);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// add to label type user's recordLabelMembers. effectively record label accepting a member
router.post('/:id/labelMembers', async (req, res) => {
    try {
        const { id } = req.params;
        const { joiner } = req.body;

        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, add to recordLabelMembers
        if (user) {
            user.recordLabelMembers.push(joiner);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// delete skill from user
router.delete('/:id/skills/:delSkill', async (req, res) => {
    try {
        const { id, delSkill } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the skill
        if (user) {
            user.skills = user.skills.filter(skill => skill != delSkill);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// delete hashtag from user
router.delete('/:id/hashtags/:delHashtag', async (req, res) => {
    try {
        const { id, delHashtag } = req.params;
        const modified = "#"+delHashtag;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the skill
        if (user) {
            user.hashtags = user.hashtags.filter(hashtag => hashtag != modified);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// delete friend from user
router.delete('/:id/friends/:delFriend', async (req, res) => {
    try {
        const { id, delFriend } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the skill
        if (user) {
            user.friends = user.friends.filter(friend => friend != delFriend);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});
// delete user from user's blockedUsers array
router.delete('/:id/blockedUsers/:unBlockee', async (req, res) => {
    try {
        const { id, unBlockee } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the skill
        if (user) {
            user.blockedUsers = user.blockedUsers.filter(blocks => blocks != unBlockee);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post('/:id/endorse', async (req, res) => {
    try {
        const { id } = req.params;
        const { endorser, skill } = req.body;
        // Find the user by id
        const endorserUser = await User.findOne({ uid: endorser });
        const user = await User.findOne({ uid: id });
        const endorserRealname = endorserUser.realname;
        user.endorsed.push({
            endorser_realname: endorserRealname,
            endorser: endorser,
            skill: skill
        });
        await user.save();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete label from user's joinedrecordLabels array
router.delete('/:id/joinedLabels/:leavingLabel', async (req, res) => {
    try {
        const { id, leavingLabel } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the label
        if (user) {
            user.joinedRecordLabels = user.joinedRecordLabels.filter(labels => labels != leavingLabel);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.delete('/:id/endorse/:skill/:endorser', async (req, res) => {
    try {
        const { id, skill, endorser } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        user.endorsed = user.endorsed.filter(endorsement => {
            return endorsement.endorser != endorser || endorsement.skill != skill;
        });
        // console.log(user.endorsed)
        await user.save();


        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// delete user from label user's recordLabelMembers array
router.delete('/:id/labelMembers/:leavingUser', async (req, res) => {
    try {
        const { id, leavingUser } = req.params;
        // Find the user by id
        const user = await User.findOne({ uid: id });
        // If user found, delete the label
        if (user) {
            user.recordLabelMembers = user.recordLabelMembers.filter(members => members != leavingUser);
            await user.save();
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

export default router;