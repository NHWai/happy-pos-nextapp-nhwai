import { config } from "./config";
import QRCode from "qrcode";

export const qrcodeUpload = async (locationId: number, tableId: number) => {
  //
  try {
    const qrImageDataBase64Uri = await QRCode.toDataURL(
      `${config.orderAppUrl}?locationId=${locationId}&tableId=${tableId}`
    );
    return qrImageDataBase64Uri;
  } catch (error) {
    console.log(error);
  }
};

export const getQrCodeUrl = (locationId: number, tableId: number) =>
  `https://msquarefdc.sgp1.cdn.digitaloceanspaces.com/happy-pos/qrcode/nhwai/locationId-${locationId}-tableId-${tableId}.png`;
