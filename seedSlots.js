const { Slot } = require('./models');

const seedSlots = async () => {
  try {
    const count = await Slot.count();
    if (count === 0) {
      const slots = [];
      for (let i = 1; i <= 10; i++) {
        slots.push({
          slotNumber: `SLOT-${i}`,
          isAvailable: true,
        });
      }
      await Slot.bulkCreate(slots);
      console.log('✅ Slots seeded successfully!');
    } else {
      console.log('ℹ️ Slots already exist, skipping seeding.');
    }
  } catch (err) {
    console.error('❌ Error seeding slots:', err);
  }
};

module.exports = seedSlots;
