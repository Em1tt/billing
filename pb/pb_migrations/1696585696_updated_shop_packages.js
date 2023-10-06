/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mylxpmbw2juqe1u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fk12mv21",
    "name": "disabled",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mylxpmbw2juqe1u")

  // remove
  collection.schema.removeField("fk12mv21")

  return dao.saveCollection(collection)
})
