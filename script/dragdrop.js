$(function () {
	var filesUpload = document.getElementById("files-upload"),
		dropArea = document.getElementById("drop-area"),
		fileList = document.getElementById("file-list");

	function traverseFiles (files) {
		var li,
			img,
			file,
			reader,
			fileInfo;
		fileList.innerHTML = "";

		for (var i=0, il=files.length; i<il; i++) {
			li = document.createElement("li");
			file = files[i];

			if (typeof FileReader !== "undefined") {
				img = document.createElement("img");
				img.setAttribute("class", "thumbnail");
				reader = new FileReader();
				reader.onload = (function (theImg) {
					return function (evt) {
						theImg.src = evt.target.result;
					};
				}(img));
				reader.readAsDataURL(file);
			}

         // Send fila her med xhr...

			fileInfo = "<div>Name: " + file.name + "</div>";
			fileInfo += "<div>Size: " + parseInt(file.size / 1024, 10) + " kb</div>";
			fileInfo += "<div>Type: " + file.type + "</div>";
			li.innerHTML = fileInfo;

			if (typeof img !== "undefined") {
				li.appendChild(img);
			}
			fileList.appendChild(li);
		}
	};

	filesUpload.onchange = function () {
		traverseFiles(this.files);
	};

	dropArea.addEventListener("dragleave", function (evt) {
		this.className = "";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.addEventListener("dragenter", function (evt) {
		this.className = "over";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.addEventListener("dragover", function (evt) {
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.addEventListener("drop", function (evt) {
		traverseFiles(evt.dataTransfer.files);
		evt.preventDefault();
		evt.stopPropagation();
	}, false);								
});
