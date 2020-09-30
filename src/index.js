import { Mongolens } from "mongolens"
import * as schema from "./schema"
import dotenv from "dotenv"
dotenv.config()

const mongolens = new Mongolens({
  uris: process.env.MONGO_CONNECTION_STRING,
  schemaDefs: schema,
  mongooseOptions: {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
})

const server = mongolens.createHandler()

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
