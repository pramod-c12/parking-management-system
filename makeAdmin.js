// makeAdmin.js
const { User } = require('./models');

(async () => {
  try {
    const user = await User.findOne({ where: { email: 'admin@example.com' } });

    if (!user) {
      console.log('User not found!');
      return;
    }

    user.isAdmin = true;
    await user.save();

    console.log(`${user.email} is now an admin ✅`);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
