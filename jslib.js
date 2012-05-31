Object.prototype.clone = function() {
  var i;
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

var ObjectMerge = function(obj1, obj2) {
	var newObj = {};
	var i;
	for (i in obj1) {
		newObj[i] = obj1[i];
	}
	for (i in obj2) {
		newObj[i] = obj2[i];
	}
	return newObj;
}