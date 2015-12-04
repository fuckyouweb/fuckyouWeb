
function credential(){
	return{
		cookieSecret:'put your cookie key here',
		mymail:{
			user:'2991923157',
			password:'123qweasdzxc',
		},
		mongo:{
			development:{
				connectionString:'mongodb://localhost/penmanbox',
			},
			production:{
				connectionString:'mongodb://localhost/penmanbox'
			}
		},
		address:{
			development:"localhost:http://localhost:",
			production:""
		}			
	}
}
module.exports = credential;