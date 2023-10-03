/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // remove
  collection.schema.removeField("skysauie")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "skysauie",
    "name": "messages",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "tuoflhuz45lk02f",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
