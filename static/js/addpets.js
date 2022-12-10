var inputFile = document.getElementById('image-uploads');
var preview = document.querySelector('.preview-photo-upload');

inputFile.style.opacity = 0;

inputFile.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    var curFiles = inputFile.files;
    if(curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var container = document.createElement('div');
        preview.appendChild(container);
        var para = document.createElement('p');
        if(validFileType(curFiles[0])) {
            para.textContent = 'File name ' + curFiles[0].name + ', file size ' + returnFileSize(curFiles[0].size) + '.';
            var image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[0]);
            container.appendChild(image);
            container.appendChild(para);
        } else {
            para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
            container.appendChild(para);
        }
    }
}

var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]
  
function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

function returnFileSize(number) {
    if(number < 1024) {
        return number + 'bytes';
    } else if(number > 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
    } else if(number > 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
    }
}

function deletePet() {
    if(CURRENT_NAME != undefined){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/delete_pet?delete_pet=${CURRENT_NAME}`, false);
        xhr.send();
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else {
            drawPetCards();
        }
    } else {
        alert("Please add pet.");
    }    
}


function drawDeletePetButton(){
    let cards = document.querySelectorAll('.card-info-wrapper');
    for(let i = 0; i < cards.length; i++){
        let cross = document.createElement('img');
        cross.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png";
        cross.onclick = deletePet;
        cross.align = "left";
        cross.width = "50";
        cross.height = "50";
        cross.id = "delete-pet-button";
        cards[i].prepend(cross);
    }
}