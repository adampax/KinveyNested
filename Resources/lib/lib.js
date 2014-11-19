function parseJSON(path) {
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, path);

	return JSON.parse(file.read().text);
}

exports.parseJSON = parseJSON;
