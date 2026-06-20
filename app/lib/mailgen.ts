import Mailgen from "mailgen";
import path from "path";

const mailGenerator = new Mailgen({
  theme: {
    path: path.resolve(process.cwd(), "node_modules/mailgen/themes/default/index.html"),
    plaintextPath: path.resolve(process.cwd(), "node_modules/mailgen/themes/default/index.txt"),
  },
  product: {
    name: "SRADA",
    link: process.env.DOMAIN!,
  },
});

export default mailGenerator;
