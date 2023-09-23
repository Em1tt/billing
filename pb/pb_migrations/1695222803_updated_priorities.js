/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("atucccouvmqrzlp")

  collection.name = "ticket_priorities"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("atucccouvmqrzlp")

  collection.name = "priorities"

  return dao.saveCollection(collection)
})
