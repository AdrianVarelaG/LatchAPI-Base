import multer from "multer";
import express from "express";
import axios from "axios";

/*
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
*/

const instanceAxios = axios.create({
  baseURL: "http://devservicios.cubetechnologies.com.mx",
  headers: { "Content-Type": "application/json" }
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  /*if (
    file.mimetype === "application/octet-stream" ||
    file.mimetype === "application/pkix-cert"
  )*/
  //accept
  cb(null, true);
  //reject a file
  //else cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 5 },
  fileFilter: fileFilter
});
const router = express.Router();

router.post(
  "/validation",
  upload.fields([
    { name: "public", maxCount: 1 },
    { name: "private", maxCount: 1 }
  ]),
  async (req, res, next) => {
    if (!req.files)
      return res.status(404).json({ error: "Certificado requerido" });
    if (!req.files.private)
      return res.status(404).json({ error: "Agrege el archivo .key" });
    if (!req.files.public)
      return res.status(404).json({ error: "Agrege el archivo .cer" });

    const privatefile = req.files.private[0];
    const publicfile = req.files.public[0];

    const request = {
      password: req.body.password,
      privado: {
        nombre: privatefile.originalname,
        tipo: privatefile.mimetype,
        content: privatefile.buffer.toString("base64")
      },
      publico: {
        nombre: publicfile.originalname,
        tipo: publicfile.mimetype,
        content: publicfile.buffer.toString("base64")
      }
    };

    try {
      const response = await instanceAxios.post(
        "/certificado/analiza",
        request
      );
      return res.status(200).json({
        certificateNumber: response.data.numeroCertificado,
        startDate: response.data.fechaInicial,
        endDate: response.data.fechaFinal,
        rfc: response.data.rfc,
        razonSocial: response.data.razonSocial
      });
    } catch (error) {
      if (error.response) {
        return res
          .status(error.response.status)
          .json({ message: error.response.data.mensaje });
      } else {
        return res.status(500).json({ message: "Error de conexion" });
      }
    }
  }
);

export default router;
