$(function () {
	var filesUpload = $("#files-upload");
	var dropArea = $("#drop-area");
	var fileList = $("#file-list");

	function traverseFiles (files) {
		var li,
			img,
			file,
			reader,
			fileInfo;
		fileList.empty();

		for (var i=0, il=files.length; i<il; i++) {
			file = files[i];
			if (!file.type.match('image.*')) {
				continue;
			}

			li = $("<li>");

			img = $("<img>");
			img.addClass("thumbnail");
			reader = new FileReader();
			reader.onload = (function (theImg) {
				return function (evt) {
					theImg.src = evt.target.result;
				};
			}(img));
			reader.readAsDataURL(file);

         // Send fila her med xhr...

			var fileInfo = $("<div>");
			fileInfo.css("display", "none");
			fileInfo.attr("id", file.size);

			fileInfo.append($("<div>").append("Name: " + file.name));
			fileInfo.append($("<div>").append("Size: " + parseInt(file.size/1024, 10) + "kB"));
			fileInfo.append($("<div>").append("Type: " + file.type));
			
			li.append(fileInfo);

			if (typeof img !== "undefined") {
				li.append(img);
				
			}
			fileList.append(li);
			$('#' + file.size).fadeIn("slow");
			$('#fileApi').effect("pulsate");
		}
	};

	filesUpload.onchange = function () {
		traverseFiles(this.files);
	};

	dropArea.get(0).addEventListener("dragleave", function (evt) {
		this.className = "";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.get(0).addEventListener("dragenter", function (evt) {
		this.className = "over";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.get(0).addEventListener("dragover", function (evt) {
		evt.preventDefault();
		evt.stopPropagation();
	}, false);

	dropArea.get(0).addEventListener("drop", function (evt) {
		traverseFiles(evt.dataTransfer.files);
		evt.preventDefault();
		evt.stopPropagation();
	}, false);								
});
