// place files you want to import through the `$lib` alias in this folder.
import QRCode from "qrcode";

async function generateQRCode(data: any) {
    const image = await QRCode.toBuffer(data, { errorCorrectionLevel: "high" });
    return image.toString("base64");
}   

export { generateQRCode };