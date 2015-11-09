// render hat
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

// render glass
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

//submit form
var ComeonNoteForm = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		// var theme = this.refs.theme.value.trim();
		// var describe = this.refs.describe.value.trim();
		// var photo = this.refs.photo.value.trim();

		// this.props.onComeonFormSubmit({theme:theme,describe:describe,photo:photo});
	
		var fd = new FormData(document.getElementById("comeonform"));
			//fd.append("CustomField", "This is some extra data");
			$.ajax({
			  url: "/upload",
			  type: "POST",
			  data: fd,
			  processData: false,  // 告诉jQuery不要去处理发送的数据
			  contentType: false   // 告诉jQuery不要去设置Content-Type请求头
			});
	},
	// handleUpload:function(e){
	// 	e.preventDefault();
	// 	var img = this.this.refs.photo.value.trim();
	// 	$.ajax({
	// 	      url: this.props.url,
	// 	      dataType: 'json',
	// 	      type: 'POST',
	// 	      data: form,
	// 	      success: function(data) {
	// 	        this.setState({data: data});
	// 	        //alert(data[0].photo);
	// 	      }.bind(this),
	// 	      error: function(xhr, status, err) {
	// 	        console.error(this.props.url, status, err.toString());
	// 	      }.bind(this)
	// 	    });
	// 	},
	// },
	render:function(){
		return (
			<form encType="multipart/form-data" id="comeonform" onSubmit={this.handleSubmit}>
				<div className="comeon_note_theme">theme:</div>
				<input type='text' className="comeon_note_themeinput" ref="theme"/>
				<div className="comeon_note_describe">describe:</div>
				<textarea className="comeon_note_describeinput" ref="describe">
				</textarea>
				<div className="comeon_note_pic">uploadpicture:(size&lt;200k)</div>
				
				<input id='file_pic' type="file" ref="photo"/>
				<input type="submit" value="Upload file"/ >
				<button type='submit' className="comeon_note_submit">ok!</button>
			</form>
		)
	}
});

var ComeonNotePicShow = React.createClass({
	render:function(){
		var len = this.props.data.length;
		var photo = this.props.data[len-1].photo;
		return(
			<div className="comeon_pic_show" ><img src={photo}/></div>
		)
	}
})

var ComeonContainer = React.createClass({
	loadFormFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
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
		        this.setState({data: data});
		        //alert(data[0].photo);
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
		},
	getInitialState: function() {
    	return {data:[{'theme':'theme','describe':'describe','photo':'test2.jpg'}]};
  	},
  	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return (			
			<div className="comeon_container">
			<ComeonHat />
			<ComeonGlass />
				<div className="comeon_note">
					<ComeonNoteForm onComeonFormSubmit={this.handleComeonFromSubmit}/>
					<ComeonNotePicShow  data={this.state.data}/>					
				</div>
			</div>
		)
	}
});


ReactDOM.render(
	<ComeonContainer url='/api/comeon'/>,
	document.getElementById('container')
)