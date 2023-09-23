/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "bqh7u72bvha2rjo",
    "created": "2023-09-20 15:14:03.533Z",
    "updated": "2023-09-20 15:14:03.533Z",
    "name": "ticket_categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wditelb8",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
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
  const collection = dao.findCollectionByNameOrId("bqh7u72bvha2rjo");

  return dao.deleteCollection(collection);
})
