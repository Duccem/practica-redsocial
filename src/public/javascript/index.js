function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var filePreview = document.createElement('img');
            filePreview.id = 'file-preview';
            filePreview.src = e.target.result;
            if (window.location.href === '/signup') {
                filePreview.style.height = '100px';
                filePreview.style.width = '100px';
            }
            var previewZone = document.getElementById('file-preview-zone');
            if (previewZone.firstChild) {
                previewZone.removeChild(previewZone.firstChild);
            }
            previewZone.appendChild(filePreview);
            previewZone.style.display = 'block';
            previewZone.style.visibility = 'visible';
        }

        reader.readAsDataURL(input.files[0]);
    }
}
function cancelar(e) {
    e.preventDefault();
    var previewZone = document.getElementById('file-preview-zone');
    if (previewZone.firstChild) {
        previewZone.removeChild(previewZone.firstChild);
    }
    previewZone.style.visibility = 'hidden';
    var fileUpload = document.getElementById('image');
    fileUpload.value = '';
    var title = document.getElementById('title');
    title.value = '';
    var description = document.getElementById('description');
    description.value = '';
}
var fileUpload = document.getElementById('image');
if (fileUpload) {
    fileUpload.onchange = function (e) {
        readFile(e.srcElement);
    }
}

var fileAvatarUpdate = document.getElementById('image-update');
if(fileAvatarUpdate){
    fileAvatarUpdate.onchange = function(e){
        let input = e.srcElement;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                let avatarimage = document.getElementById('avatar');
                avatarimage.src = e.target.result;
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
}
var btnLike = document.getElementById('btn-like');
if (btnLike) {
    btnLike.onclick = function (e) {
        e.preventDefault();
        let imageId = this.dataset.id;
        fetch(`/images/${imageId}/like`, { method: 'POST' })
            .then(async (response) => {
                let likes = document.getElementById('likes-count');
                let res = await response.json();
                console.log(res);
                console.log('hola');
                let count = parseInt(likes.innerText);
                likes.innerText = res.likes;
                if (count < parseInt(res.likes)) {
                    btnLike.innerHTML = '<i class="fa fa-thumbs-down"></i> Dislike';
                    btnLike.classList.remove('btn-success');
                    btnLike.classList.add('btn-info');
                } else {
                    btnLike.innerHTML = '<i class="fa fa-thumbs-up"></i> Like';
                    btnLike.classList.remove('btn-info');
                    btnLike.classList.add('btn-success');
                }



            })
            .catch(err => console.log(err));
    }
}


var btnDelete = document.getElementById('btn-delete');
if (btnDelete) {
    btnDelete.onclick = function (e) {
        e.preventDefault();
        let res = confirm('Are you sure you want delete this image?');
        if (res) {
            let imageId = this.dataset.id;
            fetch(`/images/${imageId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then((data) => {
                    if (data.deleted) {
                        window.location = '/';
                    }
                })
                .catch(err => console.log(err));
        }
    }
}

var btnCommentToggle = document.getElementById('btn-toggle-comment');

if (btnCommentToggle) {
    btnCommentToggle.onclick = function (e) {
        e.preventDefault();
        let cajaComentarios = document.getElementById('post-comment');
        if (cajaComentarios.style.display == 'none') {
            cajaComentarios.style.display = 'inherit'
        } else {
            cajaComentarios.style.display = 'none';
        }
    }
}

window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);


function navegar(public_id) {
    window.location.href = '/images/' + public_id;
}