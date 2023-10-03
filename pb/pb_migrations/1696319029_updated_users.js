/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("d7yrsu4m")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ngz2g2ov",
    "name": "Role",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "w5su3ppmlyowbhy",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d7yrsu4m",
    "name": "PID",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("ngz2g2ov")

  return dao.saveCollection(collection)
})
