const { JWT_SECRET = "super-strong-secret" } = process.env;

// logs fdcb4247788f13af5423a5fbb92164342e7353cc2716b3f6b746d6780014bd49, the string in .env
console.log(JWT_SECRET);
module.exports = { JWT_SECRET };
