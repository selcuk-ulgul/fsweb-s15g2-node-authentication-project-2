/**
  Diğer modüllerin JWT_SECRET'ı require yapabilmesi için bu modülü düzeltin.
 JWT_SECRET'ı  process.env'den alın. .env'den alınamadığı durumlar için de string olarak "shh"ın kullanılmasını sağlayın
 (|| operatörünü kullanabilirsin)

  Eğer bunları sağlamazsanız Testler geçmez ve diğer yazılımcılar bu repoyu klonladıklarında
  projeyi beklendiği gibi çalıştıramazlar.
 */
const jwtSecret = process.env.JWT_SECRET || "shh";
module.exports = {
  JWT_SECRET: jwtSecret,
};

// require("dotenv").config(); // .env dosyasını yükler

// const server = require("./api/server.js");

// const PORT = process.env.PORT || 9000;

// server.listen(PORT, () => {
//   console.log(`\n*** Server listening on http://localhost:${PORT} ***\n`);
// });
