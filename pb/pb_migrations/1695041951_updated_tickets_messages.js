/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tuoflhuz45lk02f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mvbsfgjf",
    "name": "ticket",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "mviw2wunogo6llf",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tuoflhuz45lk02f")

  // remove
  collection.schema.removeField("mvbsfgjf")

  return dao.saveCollection(collection)
})
