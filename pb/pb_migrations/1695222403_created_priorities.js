/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "atucccouvmqrzlp",
    "created": "2023-09-20 15:06:43.336Z",
    "updated": "2023-09-20 15:06:43.336Z",
    "name": "priorities",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8fmkhjpf",
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
  const collection = dao.findCollectionByNameOrId("atucccouvmqrzlp");

  return dao.deleteCollection(collection);
})
