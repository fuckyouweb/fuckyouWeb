var Pic = React.createClass({
	handleDelete:function(){
		if(confirm('Are you sure to delete?!!')){
			var workid = this.props.workid;
			$.ajax({
		      url: '/api/admin/deletework',
		      dataType: 'json',
		      type: 'POST',
		      data:{'workid':workid},
		      success: function(data) {
		      	if(data.code == 1){
		      		console.log(111);
		      	}
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	    }
	},
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = 'authorphoto/'+this.props.photo;
		var workid = this.props.workid;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_describe">
						<div className="index_container_theme">theme:{theme}</div>
						<div className="home_button">
							<div className="home_delete" workid={workid} onClick={this.handleDelete}>删除</div>
							<div className="home_update" workid={workid} onClick={this.handleUpdate}>修改</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

var Hot = React.createClass({
	render:function(){
		var haswork = this.props.data.length;
		if(haswork){
			var Pics = this.props.data.map(function(value,index){
				return (
					<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo} workid={value._id} describe={value.describe}/>
				);
			});
		}
		return (
			<div className="index_container_hot">
			<AuthorInfo haswork={haswork}/>
			{Pics}
			</div>
		)
	}
});

var HotContainer = React.createClass({
	loadFormFromServer:function(){
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache:false,
	      success: function(data) {
	      	if(data.code == 0){
	      		this.setState({
	      			data:[]
	      		})
	      	}else{
		        this.setState({
		        	data:data
		        });
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	getInitialState:function(){
		return {data:[]}
	},
	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return(
			<div>
				<UpdataShow updatecover={this.state.updatecover}/>
				<Hot data={this.state.data}/>
			</div>
		)
	}
});

ReactDOM.render(
	<HotContainer url="/api/home"/>,
	document.getElementById('index_hot')
)


