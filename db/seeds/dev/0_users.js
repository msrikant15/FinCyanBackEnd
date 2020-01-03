/**
 * @param {import('knex')} knex
 */
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.transaction(async tx => {
    const { count } = await tx("users")
      .count("* as count")
      .first();

    if (parseInt(count) === 0) {
      return tx("users").insert([
        {
          first_name: "Alexandr",
          last_name: "Zosimchuk",
          email: "1duglas1@gmail.com",
          password:
            "$2a$10$r7XLCsy6TSVsmf0.BN8zzePCnXUZ6Mt3KZ.vSA.5rjg0bkByqMYIO", // 123123
          code: "123456"
        }
      ]);
    } else {
      return Promise.resolve();
    }
  });
};
