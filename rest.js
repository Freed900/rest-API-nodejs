const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const host = '127.0.0.1'
const port = 3000

let topicView,mainHTML,clientJS;
fs.readFile('Blueprints\\topicView.html',(err, data) => {
    if (err)
      console.log("error: "+err)
    topicView = data.toString()
  })
fs.readFile('index.html',(err, data) => {
if (err)
    console.log("error: "+err)
    mainHTML = data.toString()
})
fs.readFile("client.js",(err, data) => {
    if (err)
    console.log("error: "+err)
    clientJS = data.toString()
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let file = 'data.json'

app.use((req, res, next) => {
  fs.readFile(file, (err, data) => {
    if (err)
      return res.status(500).send({ message: 'Ошибка при получении совета' })
    req.topics = JSON.parse(data)
    next()
  })
})

app.route('/api/topics')
.get((req, res) => {
    let topicsView="";
    var index=-1;
    for(var k in req.topics){
        index++;
        topicsView += createTopic(req.topics[k],k,index);
    };
    var tempHtml = mainHTML;
    tempHtml = tempHtml
        .replace(/{js}/g,clientJS)
        .replace(/{topics}/g,topicsView)
    
    return res.status(200).send(tempHtml);
  })
  .post((req, res) => {
    var count = Object.keys(req.topics).length;
    var id = 't'+Date.now();
    req.topics[id] = { text: "new text here" };
      var topic = createTopic(req.topics[id],id,count-1)
      fs.writeFile(
        file,
        JSON.stringify(req.topics),
        (err, response) => {
          if (err)
            return res
              .status(500)
              .send({ message: 'Невозможно создать совет' })

          return res
            .status(200)
            .send({ message: 'Совет создан.', topic:topic })
        }
      )
  })
  .put((req, res) => {
    console.log(req.body);
    if (req.body.topic.id) {
      if (!req.topics.hasOwnProperty(req.body.topic.id))
        return res
          .status(404)
          .send({ message: 'Совет не найден.' })
      
      req.topics[req.body.topic.id] = {text: req.body.topic.text };
      console.log(req.body.topic.id+": "+req.topics[req.body.topic.id].text);
      fs.writeFile(
        file,
        JSON.stringify(req.topics),
        (err, response) => {
          if (err)
            return res
              .status(500)
              .send({ message: 'Невозможно изменить совет' })
          
          return res
            .status(200)
            .send({ message: 'Совет изменен.', id: req.body.topic.id, text:req.body.topic.text })
        }
      )
    } else
      return res
        .status(400)
        .send({ message: 'Bad request.' })
  })
  .delete((req, res) => {
    if (req.body.topic.id) {
      if (req.topics.hasOwnProperty(req.body.topic.id)) {
        delete req.topics[req.body.topic.id]

        fs.writeFile(
          file,
          JSON.stringify(req.topics),
          (err, response) => {
            if (err)
              return res
                .status(500)
                .send({ message: 'Невозможно удалить совет' })

            return res
              .status(200)
              .send({ message: 'Совет удален.',id:req.body.topic.id,removed:true})
          }
        )
      } else
        return res
          .status(404)
          .send({ message: 'Совет не найден.' })
    } else
      return res
        .status(400)
        .send({ message: 'Bad request.' })
  })

app.listen(port, host, () =>
  console.log(`Запуск сервера по адрессу http://${host}:${port}`)
)

function createTopic(topic,id,index){
    let tempView = topicView;
    tempView= tempView
    .replace(/{id}/g,id)
    .replace(/{index}/g,index)
    .replace(/{text}/g,topic.text);
    return tempView;
}
