/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w5su3ppmlyowbhy",
    "created": "2023-10-03 07:43:16.771Z",
    "updated": "2023-10-03 07:43:16.771Z",
    "name": "staff_roles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8t7njxzq",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "e7ryu1we",
        "name": "permissions",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("w5su3ppmlyowbhy");

  return dao.deleteCollection(collection);
})
