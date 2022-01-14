module.exports = {
  hrPool: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: "localhost/orcl",
    poolMin: 10,
    poolMax: 14,
    poolIncrement: 0,
  },
};
