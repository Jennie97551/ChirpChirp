
async function likePost(event){
    let target = event.target;
    let post = target.parentElement;
    id = -1;
    for (const child of post.children) {
        id = child.innerText;
        break;
    }
    let response = await fetch("/main", {method: "POST", body: '{"id":' + id + '}', headers: new Headers({'content-type': 'application/json'})});
    console.log("am here");
    //'{"id":' + id + '}'
    if(response.status == 200){
        let post = target.parentElement;
        let curr = post.children[5].innerText;
        console.log(curr);
        post.children[5].innerText = parseInt(curr) + 1;
    }
}

async function deletePost(event){
    let target = event.target;
    let post = target.parentElement.parentElement;
    id = -1;
    for (const child of post.children) {
        id = child.innerText;
        break;
    }
    let response = await fetch("/api/post", {method: "DELETE", body: '{"id":' + id + '}', headers: new Headers({'content-type': 'application/json'})});
    //'{"id":' + id + '}'
    if(response.status == 200){
        let post = target.parentElement.parentElement;
        let text = post.parentElement;
        text.removeChild(post);
    }
}

async function editPost(event){
    let target = event.target;
    let post = target.parentElement.parentElement;
    id = -1;
    for (const child of post.children) {
        id = child.innerText;
        break;
    }
    let newText = prompt("Edit Chirp: ");
    if(newText != null){
        let response = await fetch("/postform/edit", {method: "POST", body: '{"id":' + id + ', "text":"' + newText + '"}', headers: new Headers({'content-type': 'application/json'})});
        //'{"id":' + id + '}'
        if(response.status == 200){
            let post = target.parentElement.parentElement;
            post.children[3].innerText = newText;
        }
    }
}

function initialize() {
    likeClass = document.getElementsByClassName("like");
    for(button of likeClass){
        button.addEventListener("click", likePost);
    }
    deleteClass = document.getElementsByClassName("delete");
    for(button of deleteClass){
        button.addEventListener("click", deletePost);
    }
    editClass = document.getElementsByClassName("edit");
    for(button of editClass){
        button.addEventListener("click", editPost);
    }
}

window.addEventListener("load", initialize);