var LoginShow = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		var form = {
			'email':this.refs.email.value.trim(),
			'psw':this.refs.psw.value.trim()
		}
		console.log(form);
		$.ajax({
		      url: this.props.url,
		      dataType: 'json',
		      type: 'POST',
		      data: form,
		      success: function(data) {
		      	if(data.code == 0) 
		      		alert('Email or password invalid!');
		         else if(data.code == 0){ //no user
		        	this.setState({
		        		data:0
		        	});
		        }else{//
		        	this.setState({
		        		data:2,
		        		user:data.username
		        	})
		        }
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	loadFormFromServer: function() {
	    $.ajax({
	      url: '/api/indexuser',
	      dataType: 'json',
	      cache: false,
	      success: function(data){//0-not,1-exist
	        if(data.code == 1){//cookie has user,redirect login
	        	this.setState({
	        		data:1
	        	});
	        }else if(data.code == 0){ //no user
	        	this.setState({
	        		data:0
	        	});
	        }else{//
	        	this.setState({
	        		data:2,
	        		user:data.username
	        	})
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	chooseLogin:function(){
		this.setState({
			data:1
		})
	},
	getInitialState: function() {
    	return {};
  	},
  	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		if(this.state.data == 1){ //show form
		return (
			<div className="login_allowloagin">
				<div className="login_allowlogin_tranigle"></div>
				<div className="login_allowlogin_rectangle"></div>
				<div className="login_allowlogin_roundleft"></div>
				<div className="login_allowlogin_roundright"></div>

				<form onSubmit={this.handleSubmit}>
					<div className="login_allowlogin_show"><p>通行证</p>						
						<input type="text" placeholder="your email" className="login_allowlogin_showword" ref="email"/>
						<input type="text" placeholder="your password" className="login_allowlogin_showword" ref="psw"/>
						<button type="submit" className="login_writelogin_submit">Touch!</button>
					</div>
				</form>
			</div>
		)
		}else if(this.state.data == 0){
			return(
				<div>
				<a onClick={this.chooseLogin}>Log in</a>
				<a href="login.html">New user</a>
				</div>
			)
		}else{
			return(
				<div>
				<p className="header_welcome">Welcome {this.state.user} !</p>
				</div>
			)
		}
	}
});

ReactDOM.render(
	<LoginShow url="/api/register"/>,
	document.getElementById('index_log')
)