const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { 
  User,  
  validateUserAdd, 
  validateUserEdit,
  validateUserLogin,
  fieldsUser
} = require('../models/user-mdl');

async function addUser(session, dataBody) {
  const { error } = validateUserAdd(dataBody);
  if(error) return [400, error.details[0].message];
  
  let user = await User.findOne({ username: dataBody.username });
  if (user) return [400,`Username sudah terdaftar!`];

  user = new User({
    username: dataBody.username,
    password: dataBody.password,
    accountnumber: dataBody.accountnumber,
    emailaddress: dataBody.emailaddress,
    identitynumber: dataBody.identitynumber
  });

  await user.save({ session: session });

  return [200, "Data user berhasil di simpan!"];
}

async function editUser(session, dataParams, dataBody) {
  const { error } = validateUserEdit(dataBody);
  if ( error ) return [400, error.details[0].message];

  let user = await User.findOneAndUpdate({ username: dataParams.username },
    {
      accountnumber: dataBody.accountnumber,
      emailaddress: dataBody.emailaddress,
      identitynumber: dataBody.identitynumber
  },{ session: session });
  if (!user) return [404, `Data user tidak di temukan!`];

  return [200, "Edit data user berhasil!"];
}

async function getUser() {
  let user = await User.aggregate([
    { '$project': fieldsUser }
  ]);

  let resDec = [200,user];
  return resDec;
}

async function getUserByAccountNumber(dataParams) {
  let user = await User.aggregate([
    { "$match": { accountnumber: dataParams.accountnumber }},
    { '$project': fieldsUser }
  ]);

  let resDec = [200,user];
  return resDec;
}

async function getUserByIdentityNumber(dataParams) {
  let user = await User.aggregate([
    { "$match": { identitynumber: dataParams.identitynumber }},
    { '$project': fieldsUser }
  ]);

  let resDec = [200,user];
  return resDec;
}

async function deleteUser(session, dataParams) {
  const user = await User.findOneAndRemove({
    username: dataParams.username
  }, { session: session });
  if (!user) return [404, `Data user tidak di temukan!`];
  
  return [200, "Delete data user berhasil!"];
}

async function loginUser(dataBody) {
  const { error } = validateUserLogin(dataBody);
  if (error) return [400, error.details[0].message];
  
  console.log('kesini')
  let user = await User.findOne({ 
    username: dataBody.username,
    password: dataBody.password
   });
  if (!user){
    return [400, `User id atau password salah!`];
  }
  
  const token = user.generateAuthToken();
  
  return [200,{
    "token" : token,
    "username" : user.username,
    "accountnumber" : user.accountnumber
  }];
};

exports.addUser = addUser;
exports.editUser = editUser;
exports.getUser = getUser;
exports.getUserByAccountNumber = getUserByAccountNumber;
exports.getUserByIdentityNumber = getUserByIdentityNumber;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;