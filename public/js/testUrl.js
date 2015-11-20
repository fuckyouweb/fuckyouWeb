var url = window.location.href;
console.log(url);
if(url != 'http://localhost:3000/index.html'){
	window.location = 'http://localhost:3000/500.html'
}