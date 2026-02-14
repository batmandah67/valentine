import QRCode from "qrcode";
import { writeFileSync } from "fs";

// Change this URL to your deployed URL
const URL = process.argv[2] || "https://ocir.vercel.app";

async function generate() {
  // Generate QR as PNG file
  await QRCode.toFile("./public/qr-code.png", URL, {
    width: 500,
    margin: 2,
    color: {
      dark: "#e11d48",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  console.log(`QR code generated at ./public/qr-code.png`);
  console.log(`URL: ${URL}`);

  // Also generate SVG
  const svg = await QRCode.toString(URL, {
    type: "svg",
    width: 500,
    margin: 2,
    color: {
      dark: "#e11d48",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  writeFileSync("./public/qr-code.svg", svg);
  console.log(`QR SVG generated at ./public/qr-code.svg`);
}

generate().catch(console.error);
