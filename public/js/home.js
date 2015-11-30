var Pic = React.createClass({
	handledelete:function(){
		if(confirm('Are you sure to delete?!!')){
			var id = this.props.id;
			console.log(id);
			$.ajax({
		      url: '/api/deletework',
		      dataType: 'json',
		      type: 'POST',
		      data:{'workid':id},
		      success: function(data) {
		      	if(data.code == 1){
		      		alert('delete success!');
		      		window.location.reload();
		      	}
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	    }
	},
	handleupdate:function(){

	},
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = 'authorphoto/'+this.props.photo;
		var id = this.props.id;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_describe">
						<div className="index_container_theme">theme:{theme}</div>
						<div className="home_button">
							<div className="home_delete" id={id} onClick={this.handledelete}>删除</div>
							<div className="home_update" id={id} onClick={this.handleupdate}>修改</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

var AuthorInfo = React.createClass({
	render:function(){
		var haswork = this.props.haswork;
		return(
			<div className="home_anthorinfo">
				<div className="home_head">
					<img src="head/penmanbox_dog.png"/>
				</div>
				<div className="home_changehead">换头</div>
				<div className={haswork ? "index_container_line" : ''}></div>
				<div className={haswork ? "home_no" : "home_nowork"}>居然一个作品都没有，你也是够了。。。</div>
			</div>
		)
	}
})

var Hot = React.createClass({
	render:function(){
		var haswork = this.props.data.length;
		//console.log(haswork);
		if(haswork){
			var Pics = this.props.data.map(function(value,index){
				return (
					<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo} id={value._id}/>
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
	      	console.log(data);
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
				<Hot data={this.state.data}/>
			</div>
		)
	}
});

ReactDOM.render(
	<HotContainer url="/api/home"/>,
	document.getElementById('index_hot')
)


