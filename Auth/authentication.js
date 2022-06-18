const {verify} = require('jsonwebtoken');
const Account = require('../Schemas/account_schema');

const authenticate =  async (req, res, next) => {
    // get token
    const token = req.headers.get('Authorization');

    // check availability of token
    if (!token) {}// error

    // verify token
    const isTokenValid = verify(token);

    if (!isTokenValid) {} // error

    // find account 
    const account = await Account.findOne({ token });

    if (!account) {} // error

    req.account = account;

    return next();
}


module.exports = authenticate;