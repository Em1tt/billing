/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mviw2wunogo6llf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cbpbkwtf",
    "name": "user",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
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

  // remove
  collection.schema.removeField("cbpbkwtf")

  return dao.saveCollection(collection)
})
