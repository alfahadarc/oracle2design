res.status(500).json(message.internalServerError());
res.status(400).json(message.error(""));
res.status(200).json(message.success(""));

function hash(password) {
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in database here
  });
}
