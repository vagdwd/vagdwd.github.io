var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {
	// here be the transaction
	// do SQL magic here using the tx object
	tx.executeSql('CREATE TABLE clickdata (url, x, y, r)');
});
HeatMapCollector.init(function(data) {
	var data = data;
	db.transaction(function (tx) {
		// here be the transaction
		// do SQL magic here using the tx object
		var query = 'INSERT INTO clickdata VALUES ("' + location.href + '","' + data.x +'","' + data.y +'","' + data.r + '")';
		tx.executeSql(query);
	});
});