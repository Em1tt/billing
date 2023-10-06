/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mt7yc0bvyh16n0x")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ap3td6q9",
    "name": "render",
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
  const collection = dao.findCollectionByNameOrId("mt7yc0bvyh16n0x")

  // remove
  collection.schema.removeField("ap3td6q9")

  return dao.saveCollection(collection)
})
