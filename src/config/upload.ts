import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "./config";
import QRCode from "qrcode";

// Set S3 endpoint to DigitalOcean Spaces
const s3 = new S3Client({
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretKeyId,
  },
  endpoint: config.digitalOceanEndPoint,
  region: "sgp1",
});

export const qrcodeUpload = async (locationId: number, tableId: number) => {
  //
  try {
    const qrImageData = await QRCode.toDataURL(
      `${config.orderAppUrl}?locationId=${locationId}&tableId=${tableId}`
    );
    const input = {
      Bucket: "msquarefdc",
      Key: `happy-pos/qrcode/nhwai/locationId-${locationId}-tableId-${tableId}.png`,
      ACL: "public-read",
      Body: Buffer.from(
        qrImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };
    const command = new PutObjectCommand(input);
    await s3.send(command);
  } catch (error) {
    console.log(error);
  }
};

export const getQrCodeUrl = (locationId: number, tableId: number) =>
  `https://msquarefdc.sgp1.cdn.digitaloceanspaces.com/happy-pos/qrcode/nhwai/locationId-${locationId}-tableId-${tableId}.png`;

//set upload func
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "msquarefdc",
    acl: "public-read",
    key: function (request, file, cb) {
      cb(null, `happy-pos/nhwai/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("menuImg", 1);
