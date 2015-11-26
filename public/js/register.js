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
		         else 
		         	alert('Login success!');
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	render:function(){
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
	}
});

ReactDOM.render(
	<LoginShow url="/api/register"/>,
	document.getElementById('index_log')
)