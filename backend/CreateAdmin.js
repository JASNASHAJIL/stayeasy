const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

async function createDefaultAdmin() {
  try {
    const defaultPhone = process.env.DEFAULT_ADMIN_PHONE || "9999999999";
    const defaultName = process.env.DEFAULT_ADMIN_NAME || "Super Admin";
    const defaultUsername = (process.env.DEFAULT_ADMIN_USERNAME || "admin").toLowerCase();
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

    const exists = await Admin.findOne({ phone: defaultPhone });
    if (exists) {
      console.log("Default admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await Admin.create({
      name: defaultName,
      phone: defaultPhone,
      username: defaultUsername,
      password: hashedPassword, // ✅ hashed
      role: "admin",
    });

    console.log("✅ Default Admin Created Successfully");
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

module.exports = createDefaultAdmin;
