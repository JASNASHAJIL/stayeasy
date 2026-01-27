const Admin = require("./models/Admin");

async function createDefaultAdmin() {
  try {
    const defaultPhone = process.env.DEFAULT_ADMIN_PHONE || "9999999999";
    const defaultName = process.env.DEFAULT_ADMIN_NAME || "Super Admin";
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

    const exists = await Admin.findOne({ phone: defaultPhone });
    if (exists) {
      console.log("Default admin already exists");
      return;
    }

    await Admin.create({
      name: defaultName,
      phone: defaultPhone,
      username: defaultUsername,
      password: defaultPassword, // plain, will be hashed by pre-save hook
      role: "admin",
    });

    console.log("Default Admin Created Successfully");
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
}

module.exports = createDefaultAdmin;
