// var LoginAllowLogin= React.createClass({
// 	render:function(){
// 		var len = this.props.data.length-1;
// 		console.log("len="+len);
// 		var name = this.props.data[len].name;
// 		var email = this.props.data[len].email;
// 		return (
// 			<div className="login_allowloagin">
// 				<div className="login_allowlogin_tranigle"></div>
// 				<div className="login_allowlogin_rectangle"></div>
// 				<div className="login_allowlogin_roundleft"></div>
// 				<div className="login_allowlogin_roundright"></div>
// 				<LoginAllowloginShow name={name} email={email}/>
				
// 			</div>
// 		)
// 	}
// });
$('document').ready(function(){
	var turnPic = $('#turnPic');
	var li = $('#turnPic li');
	var ul = $('#turnPic ul');
	var ul0 = ul[0];
	var flag = 0;

	function turn(value){
		var	translate = 0;
		
		if (value == null){
			if(flag == 3) 
				flag = 0;
			else
				translate = -25*(++flag);		
		}else{
			flag = parseInt(value)-1;	
			translate = -25*(--value);		
		}	
		//ul0.style.transform = "translate("+translate+"%)";
		ul.css({
			'transform':"translate("+translate+"%)"
		});
	}

	var time = setInterval(turn,1000);

	// var mouseenter_li = function(){
	// 	turn(this.innerHTML);
	// 	clearInterval(time);
	// }

	// var mouseout_li = function(){
	// 	time = setInterval(turn,1000);
	// }

	// for(var i=4 ; i<8 ;i++){		
	// 	li[i].addEventListener('mouseenter',mouseenter_li,false);
	// 	li[i].addEventListener('mouseout',mouseout_li,false);
	// }
});

