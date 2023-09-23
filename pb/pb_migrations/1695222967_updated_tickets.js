/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // remove
  collection.schema.removeField("asnsev4y")

  // remove
  collection.schema.removeField("ewvdgogm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p40lwlv4",
    "name": "priority",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "atucccouvmqrzlp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "69wgl3fa",
    "name": "category",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "bqh7u72bvha2rjo",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ewvdgogm",
    "name": "category",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("p40lwlv4")

  // remove
  collection.schema.removeField("69wgl3fa")

  return dao.saveCollection(collection)
})
