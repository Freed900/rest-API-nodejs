console.log("js was loaded")

function changeClick(id){
  console.log('button was clicked');
  fetch('/api/topics', {
    method: 'put',
    body: JSON.stringify( {topic:{"id":id,"text":document.querySelector('div#'+id+">textarea").value}}), 
    headers: {'Content-Type': 'application/json'}
  })
    .then(function(response) {
      if (response.ok) {
        response.json().then(function (data) {
          document.querySelector('div#'+data.id+">textarea").value = data.text;
        })
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}

function addClick(){
  console.log('button was clicked');
  fetch('/api/topics', 
  {
    method: 'post',
  })
  .then(function(response) {
    if(!response.ok) 
      throw new Error('Request failed.');
    response.json().then(function(data){
      document.getElementById("topics").innerHTML += data.topic;
    })
  })
  .catch(function(error) {
    console.log(error);
  });
}

function deleteClick(id){
  console.log('button was clicked');
  fetch('/api/topics', 
  {
    method: 'delete',
    body: JSON.stringify( {topic:{"id":id}}), 
    headers: {'Content-Type': 'application/json'}
  })
  .then(function(response) {
    if(!response.ok) 
      throw new Error('Request failed.');
    response.json().then(function(data){
      console.log(data)
      if(data.removed)
        document.getElementById(data.id).remove()
    })
  })
  .catch(function(error) {
    console.log(error);
  });
}
