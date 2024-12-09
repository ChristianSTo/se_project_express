const { JWT_SECRET = "super-strong-secret" } = process.env;
// fdcb4247788f13af5423a5fbb92164342e7353cc2716b3f6b746d6780014bd49 in .env for the Production mode (VM)
// ae48bdade2aaf742864bdb0b0db85a8ecf0f0a2c3a0d44b3d9a459f27365ec31 in .env for the Development mode
module.exports = { JWT_SECRET };
