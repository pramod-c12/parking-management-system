const { User } = require('../models');

module.exports = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
