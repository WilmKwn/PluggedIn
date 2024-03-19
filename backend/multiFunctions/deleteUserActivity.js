/* java script function that takes in a const {} data structure with one key val - uid: id
    * and then deletes the user with that id from the database
    */


import { User } from '../models/userModel.js';
import { Post } from '../models/postModel.js';
const router = express.Router()
import express from 'express';



export const deleteUserActivity = async (data) => {
    try {

        const query = {
            uid: data.uid,
        };
        
        //const user = await User.findOneAndDelete( query );

        // if (user === null) {
        //     console.log("not found")
        // } else {
        //     console.log("found")
        // }

        // Find and delete posts where owner matches the provided uid
        const result = await Post.deleteMany({ owner: query.uid });

        console.log("deleted");
        
        // Log the number of deleted posts
        console.log(`${result.deletedCount} posts deleted for owner with uid: ${uid}`);

        return;
    }   catch (err) {
        return err.message;
    }
}