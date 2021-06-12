const express = require(`express`);
const router = express.Router();
const mongoose = require('mongoose');

const { Auth } = require('../middleware/auth');

const userCon = require('../controlers/user-con');

// Get all data user
router.get('/',Auth, async(req, res) => {
  const resGetUser = await userCon.getUser();
  if (resGetUser[0] !== 200) return res.status(resGetUser[0]).send({
    "status": "error",
    "pesan": resGetUser[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetUser[1]
  });
});

// Get data user by Account Number
router.get('/account-number/:accountnumber',Auth, async(req, res) => {
  const resGetUser = await userCon.getUserByAccountNumber(req.params);
  if (resGetUser[0] !== 200) return res.status(resGetUser[0]).send({
    "status": "error",
    "pesan": resGetUser[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetUser[1]
  });
});

// Get data user by Identity Number
router.get('/identity-number/:identitynumber',Auth, async(req, res) => {
  const resGetUser = await userCon.getUserByIdentityNumber(req.params);
  if (resGetUser[0] !== 200) return res.status(resGetUser[0]).send({
    "status": "error",
    "pesan": resGetUser[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": resGetUser[1]
  });
});

// Create user
router.post('/', async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resAddUser = await userCon.addUser(session, req.body);
  if(resAddUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resAddUser[0]).send({
      "status": "error",
      "pesan": resAddUser[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resAddUser[1],
    "data": [{}]
  });
});

// Edit user
router.put('/:username', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resUpdateUser = await userCon.editUser(session, req.params, req.body);
  if ( resUpdateUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resUpdateUser[0]).send({
      "status": "error",
      "pesan": resUpdateUser[1],
      "data": [{}]
    });
  }

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resUpdateUser[1],
    "data": [{}]
  });
});

// Delete user
router.delete('/:username', Auth, async(req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const resDelUser = await userCon.deleteUser(session, req.params );
  if( resDelUser[0] !== 200) {
    await session.abortTransaction();
    session.endSession();
    return res.status(resDelUser[0]).send({
      "status": "error",
      "pesan": resDelUser[1],
      "data": [{}]
    })
  };

  await session.commitTransaction();
  session.endSession();
  res.send({
    "status": "berhasil",
    "pesan": resDelUser[1],
    "data": [{}]
  });
});

// Login user
router.post('/login', async(req, res) => {
  const resLogin = await userCon.loginUser(req.body);
  if (resLogin[0] !== 200) return res.status(resLogin[0]).send({
    "status": "error",
    "pesan": resLogin[1],
    "data": [{}]
  });

  res.send({
    "status": "berhasil",
    "pesan": "berhasil",
    "data": [resLogin[1]]
  });
});

module.exports = router;