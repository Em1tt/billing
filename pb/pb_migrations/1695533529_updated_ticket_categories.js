/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqh7u72bvha2rjo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gwrvofxo",
    "name": "weight",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqh7u72bvha2rjo")

  // remove
  collection.schema.removeField("gwrvofxo")

  return dao.saveCollection(collection)
})
