
function checkRequiredFields(_g, _fields) {
	var gridChanges = _g.getChanges({ format: 'byVal' });
	const allLists = [...gridChanges.addList, ...gridChanges.updateList];
	for (const item of allLists) {
		for (const field in _fields) {
			if (item[field] == undefined || item[field] == null || item[field] == "") {
				return _fields[field];
			}
		}
	}
	return "";
}