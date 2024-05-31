// place files you want to import through the `$lib` alias in this folder.
import QRCode from "qrcode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateQRCode(data: any) {
    const image = await QRCode.toBuffer(data, { errorCorrectionLevel: "high" });
    return image.toString("base64");
}   

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateQRCodeFixed(data: any, size: number) {
    const image = await QRCode.toBuffer(data, { errorCorrectionLevel: "high", version: size });
    return image.toString("base64");
}   

export { generateQRCode, generateQRCodeFixed };