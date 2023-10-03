/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tuoflhuz45lk02f")

  // remove
  collection.schema.removeField("afbi6eyw")

  // remove
  collection.schema.removeField("emnd7qku")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dltk80wi",
    "name": "content",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tuoflhuz45lk02f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "afbi6eyw",
    "name": "content",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "emnd7qku",
    "name": "files",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": [],
      "protected": false
    }
  }))

  // remove
  collection.schema.removeField("dltk80wi")

  return dao.saveCollection(collection)
})
