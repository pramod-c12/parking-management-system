const { Slot } = require('./models');

const seedSlots = async () => {
  try {
    const slots = [];

    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `SLOT-${i}`,
        isAvailable: true,
      });
    }

    await Slot.bulkCreate(slots);
    console.log('✅ Slots seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding slots:', err);
    process.exit(1);
  }
};

seedSlots();
