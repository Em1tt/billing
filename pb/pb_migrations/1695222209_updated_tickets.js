/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // remove
  collection.schema.removeField("6uj6badp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fpqi5ois",
    "name": "text",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6uj6badp",
    "name": "text",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("fpqi5ois")

  return dao.saveCollection(collection)
})
