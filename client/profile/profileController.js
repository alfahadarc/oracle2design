const message = require("../../middleware/message");
const profileDBAPI = require("./profileDBAPI");

async function getProfile(req, res, next) {
  try {
    var userName = req.username;
    var result = await profileDBAPI.getUserProfileFromDB(userName);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(message.internalServerError());
  }
}

async function updateProfile(req, res, next) {
  try {
    var userName = req.username;
    var addressDescription = req.body.ADDRESS_DESCRIPTION;
    var phoneNumber = req.body.PHONE_NUMBER;

    await profileDBAPI.updateProfile(userName, addressDescription, phoneNumber);

    res.status(200).json(message.success("Updated Successfully"));
  } catch (err) {
    res.status(500).json(message.internalServerError());
  }
}

module.exports = { getProfile, updateProfile };
