var ComeonHat = React.createClass({
	render:function(){
		return (
			<div className="comeon_hat">
				<div className="comeon_hat_roundup"></div>
				<div className="comeon_hat_rect"></div>
				<div className="comeon_hat_rectdown"></div>
				<div className="comeon_hat_rounddown"></div>
			</div>
		)
	}
});

var ComeonGlass = React.createClass({
	render:function(){
		return(
			<div className="comeon_glass">
				<div className="comeon_glass_left"></div>
				<div className="comeon_glass_right"></div>
				<div className="comeon_glass_midrect"></div>
			</div>
		)
	}
});

var ComeonNoteForm = React.createClass({
	handleSubmit:function(){
		e.preventDefault();
		var theme = this.refs.theme.value.trim();
		var describe = this.refs.describe.value.trim();
		var photo = this.refs.photo.value.trim();

		this.props.onComeonFormSubmit({theme:theme,describe:describe,photo:photo});
	},
	render:function(){
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="comeon_note_theme">theme:</div>
				<input type='text' className="comeon_note_themeinput" ref="theme"/>
				<div className="comeon_note_describe">describe:</div>
				<textarea className="comeon_note_describeinput" ref="describe">
				</textarea>
				<div className="comeon_note_pic">uploadpicture:(size200k)</div>
				<input id='file_pic' type="file" ref="photo"/>
				<button type='submit' className="comeon_note_submit">ok!</button>
			</form>
		)
	}
});

var ComeonContainer = React.createClass({
	handleComeonFromSubmit:function(forminfo){
		var form = forminfo;
		//this.setState = form;
		//发送服务的请求
		 $.ajax({
		      url: this.props.url,
		      dataType: 'json',
		      type: 'POST',
		      data: form,
		      success: function(data) {
		        //this.setState({data: data});
		        alert(data);

		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	render:function(){
		return (			
			<div className="comeon_container">
			<ComeonHat />
			<ComeonGlass />
				<div className="comeon_note">
					<ComeonNoteForm onComeonFormSubmit={this.handleComeonFromSubmit}/>
					<div className="comeon_pic_show"></div>
				</div>
			</div>
		)
	}
})


ReactDOM.render(
	<ComeonContainer url='api/comeon'/>,
	document.getElementById('container')
)