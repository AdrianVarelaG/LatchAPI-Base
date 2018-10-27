import express from "express";
import assert from "assert";
import { ObjectID } from "mongodb";
import mongoUtil from "../utils/mongoUtil";

import { sortCollection, collectionCount } from "../utils/collectionUtils";

const router = express.Router();
const COLLECTION_POSFIX = "clients";

const collectionName = tendant => (tendant || "") + COLLECTION_POSFIX;

router.get("/", (req, res, next) => {
  //return res.status(200).json({ ok: "Si aqui el server" });
  const db = mongoUtil.getDb();
  const collection = collectionName(req.tendant);
  const query = req.query;
  let criteria = {};
  collectionCount(db, collection, req.query)
    .then(count => {
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", count);
      if (count === 0) return res.status(200).json([]);

      /*if (query.text) {
        criteria["$text"] = {
          $search: query.text
        };
      }*/

      let cursor = db.collection(collection).find(criteria);
      cursor.skip(Number(query._start));
      cursor.limit(Number(query._end) - Number(query._start));
      console.log(sortCollection(query));
      cursor.sort(sortCollection(query));

      let info = [];

      cursor.forEach(
        client => {
          let { _id, ...data } = client;
          info.push({ id: _id, ...data });
        },
        err => {
          assert.equal(err, null);
          res.status(200).json(info);
        }
      );
    })
    .catch(err => next(err));
});

router.post("/", async (req, res, next) => {
  try {
    const db = mongoUtil.getDb();
    const myCollection = collectionName(req.tendant);
    const client = {
      rfc: req.body.rfc,
      razonSocial: req.body.razonSocial
    };
    const collection = db.collection(myCollection);

    let r = await collection.insertOne(client);
    assert.equal(1, r.insertedCount);

    let { _id, ...data } = r.ops[0];
    res.status(200).json({
      id: _id,
      ...data
    });

    /* collection
      .indexExists("clientTextIndex")
      .then(result => {
        if (result === false) {
          collection = collection
            .createIndex(
              { rfc: "text", razonSocial: "text" },
              { name: "clientTextIndex" }
            )
            .then(result => {
              console.log("Indice creado", result);
            })
            .catch(err => {
              console.log("Error al crear el indice ", err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });*/
  } catch (err) {
    next(err);
  }
});

router.get("/:clientId", async (req, res, next) => {
  const id = req.params.clientId;

  try {
    const db = mongoUtil.getDb();
    const collection = collectionName(req.tendant);
    let docs = await db.collection(collection).findOne({ _id: ObjectID(id) });
    let { _id, ...data } = docs;

    res.status(200).json({
      id: _id,
      ...data
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:clientId", (req, res, next) => {
  const id = req.params.clientId;

  res.status(200).json({
    message: "Updated client",
    id: id
  });
});

router.delete("/:clientId", (req, res, next) => {
  const id = req.params.clientId;
  res.status(200).json({
    message: "Deleted client!"
  });
});

export default router;
