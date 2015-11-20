
function credential(){
	return{
		cookieSecret:'put your cookie key here',
		mymail:{
			user:'',
			password:'',
		},
		mongo:{
			development:{
				connectionString:'mongodb://localhost/penmanbox',
			},
			production:{
				connectionString:'mongodb://localhost/penmanbox'
			}
		}
	}
}
module.exports = credential;