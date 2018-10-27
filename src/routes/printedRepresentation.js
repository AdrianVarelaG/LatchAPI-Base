//300 x 140 image size.
import multer from "multer";
import express from "express";
import axios from "axios";

const instanceAxios = axios.create({
  baseURL: "http://devservicios.cubetechnologies.com.mx",
  headers: { "Content-Type": "application/json" }
});
const imageType = /image.*/;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (imageType.test(file.mimetype))
    //accept
    cb(null, true);
  //reject a file
  else cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 10 },
  fileFilter: fileFilter
});
const router = express.Router();

router.post("/template", upload.single("logo"), async (req, res, next) => {
  const request = {
    templateId: req.body.id,
    razonSocial: req.body.razonSocial,
    rfc: req.body.rfc,
    regimenFiscal: {
      claveSat: req.body.regimenFiscalKey,
      descripcion: req.body.regimenFiscalValue
    },
    direccion: {
      codigoPostal: req.body.codigoPostal,
      estado: req.body.estado,
      municipio: req.body.municipio
    }
  };
  if (req.body.calle) request.direccion.calle = req.body.calle;
  if (req.body.numeroExterior)
    request.direccion.numeroExterior = req.body.numeroExterior;
  if (req.body.numeroInterior)
    request.direccion.numeroInterior = req.body.numeroInterior;
  if (req.body.colonia) request.direccion.colonia = req.body.colonia;
  if (req.file) {
    request.logo = {
      nombre: req.file.originalname,
      tipo: req.file.mimetype,
      content: req.file.buffer.toString("base64")
    };
  }

  try {
    const response = await instanceAxios.post("/pre-view", request);
    res.set("Content-Type", "application/pdf");
    const buffer = Buffer.from(response.data.content, "base64");
    res.send(buffer);
  } catch (error) {
    console.log(error.response);

    if (error.response) {
      return res
        .status(error.response.status)
        .send(error.response.data.mensaje);
    }
    return res.status(500).send({ error: "Error inesperado" });
  }
});

export default router;
