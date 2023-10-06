/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mylxpmbw2juqe1u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kzxiqbzf",
    "name": "slugReference",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mylxpmbw2juqe1u")

  // remove
  collection.schema.removeField("kzxiqbzf")

  return dao.saveCollection(collection)
})
