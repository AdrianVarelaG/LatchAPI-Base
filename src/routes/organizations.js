import express from "express";
import assert from "assert";
import mongoUtil from "../utils/mongoUtil";

const router = express.Router();
const COLLECTION_NAME = "organizations";

router.head("/rfc/:rfc", async (req, res, next) => {
  const rfcId = req.params.rfc;
  try {
    const db = mongoUtil.getDb();
    console.log(db);

    let organization = await db
      .collection(COLLECTION_NAME)
      .findOne({ rfc: rfcId });
    assert.notStrictEqual(null, organization);
    res.status(200).json();
  } catch (err) {
    res.status(404).json();
  }
});

export default router;
