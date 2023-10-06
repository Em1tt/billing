/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mylxpmbw2juqe1u",
    "created": "2023-10-06 09:46:42.003Z",
    "updated": "2023-10-06 09:46:42.003Z",
    "name": "shop_packages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xh7lgbwp",
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
        "id": "93mdlq9t",
        "name": "price",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "3lobkm1i",
        "name": "configuration",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "zrlbiggs",
        "name": "product",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "mt7yc0bvyh16n0x",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("mylxpmbw2juqe1u");

  return dao.deleteCollection(collection);
})
