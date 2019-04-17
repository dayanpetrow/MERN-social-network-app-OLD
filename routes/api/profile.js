const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//load validation
const validateProfileInput = require('../../validation/profile');

/*  
@route   GET api/profile/test
@desc    Tests profile route
@access  Public 
*/
router.get('/test', (req, res) => res.json({msg: "Profile route works!"}));

/*  
@route   GET api/profile
@desc    Return current user profile
@access  Private 
*/
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }) //because it references the user model
        .populate('user', ['name', 'avatar']) //include the user data in the response
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user!'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/*  
@route   POST api/profile/
@desc    Create or update user profile
@access  Private 
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id; //model reference
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
    //skills = split into an array
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                //update profile because it exists
                Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    {$set: profileFields }, 
                    { new: true }
                ).then(profile => res.json(profile));
            } else {
                //create profile

                //check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = "That handle already exists!";
                            res.status(400).json(errors);
                        }

                        //save profile
                        new Profile(profileFields).save()
                            .then(profile => res.json(profile));

                    });
            }
        });
});


module.exports = router;