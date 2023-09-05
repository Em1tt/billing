/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // remove
  collection.schema.removeField("caabtta6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cht3dy3c",
    "name": "subject",
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
    "id": "6uj6badp",
    "name": "text",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asnsev4y",
    "name": "priority",
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
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "caabtta6",
    "name": "field",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("cht3dy3c")

  // remove
  collection.schema.removeField("6uj6badp")

  // remove
  collection.schema.removeField("asnsev4y")

  return dao.saveCollection(collection)
})
