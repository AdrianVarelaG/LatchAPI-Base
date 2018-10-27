export const collectionCount = (db, collection, params) => {
  return db.collection(collection).countDocuments({}, {});
};

export const sortCollection = params => {
  let sort = {};
  const order = params._order === "DESC" ? -1 : 1;
  if (params._sort === "id") sort["_id"] = order;
  else sort[params._sort] = order;

  return sort;
};
