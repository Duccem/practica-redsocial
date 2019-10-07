function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var filePreview = document.createElement('img');
            filePreview.id = 'file-preview';
            filePreview.src = e.target.result;
            var previewZone = document.getElementById('file-preview-zone');
            if(previewZone.firstChild){
                previewZone.removeChild(previewZone.firstChild);
            }
            previewZone.appendChild(filePreview);
            previewZone.style.visibility = 'visible';
        }

        reader.readAsDataURL(input.files[0]);
    }
}
function cancelar(e){
    e.preventDefault();
    var previewZone = document.getElementById('file-preview-zone');
    if(previewZone.firstChild){
        previewZone.removeChild(previewZone.firstChild);
    }
    previewZone.style.visibility = 'hidden';
    var fileUpload = document.getElementById('image');
    fileUpload.value = '';
    var title = document.getElementById('title');
    title.value = '';
    var description = document.getElementById('description');
    description.value='';
}
var fileUpload = document.getElementById('image');
if(fileUpload){
    fileUpload.onchange = function (e) {
        readFile(e.srcElement);
    }
} 
var btnLike = document.getElementById('btn-like');
if(btnLike){
    btnLike.onclick = function(e){
        e.preventDefault();
        let imageId = this.dataset.id;
        fetch(`/images/${imageId}/like`,{method:'POST'})
            .then(async (response)=>{ 
                let likes = document.getElementById('likes-count');
                res =await response.json();
                likes.innerText=  res.likes;
            })
            .catch(err=>console.log(err));
    }
}


var btnDelete = document.getElementById('btn-delete');
if(btnDelete){
    btnDelete.onclick=function(e){
        e.preventDefault();
        let res = confirm('Are you sure you want delete this image?');
        if(res){
            let imageId = this.dataset.id;
            fetch(`/images/${imageId}`,{method:'DELETE'})
                .then(response=>response.json())
                .then((data) =>{
                    if(data.deleted){
                        window.location = '/';
                    }
                })
                .catch(err => console.log(err));
        }
    }
}

var btnCommentToggle = document.getElementById('btn-toggle-comment');

if(btnCommentToggle){
    btnCommentToggle.onclick = function(e){
        e.preventDefault();
        let cajaComentarios = document.getElementById('post-comment');
        if(cajaComentarios.style.display=='none'){
            cajaComentarios.style.display='inherit'
        }else{
            cajaComentarios.style.display='none';
        }
    }
}

