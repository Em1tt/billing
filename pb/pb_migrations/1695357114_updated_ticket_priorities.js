/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("atucccouvmqrzlp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jcbajveh",
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
  const collection = dao.findCollectionByNameOrId("atucccouvmqrzlp")

  // remove
  collection.schema.removeField("jcbajveh")

  return dao.saveCollection(collection)
})
