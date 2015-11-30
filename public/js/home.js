var Pic = React.createClass({
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = 'authorphoto/'+this.props.photo;
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_author">
						<img src={photo} />
					</div>
					<div className="index_container_describe">
						<div className="index_container_boss">boss:{name}</div>
						<div className="index_container_theme">theme:{theme}</div>
					</div>
				</div>
			</div>
		)
	}
});

var Hot = React.createClass({
	render:function(){
		var haswork = this.props.data.length;
		console.log(haswork);
		if(haswork){
			var Pics = this.props.data.map(function(value,index){
				return (
					<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo}/>
				);
			});
		}
		return (
			<div className="index_container_hot">
			<div className={haswork ? "index_container_line" : ''}></div>
			<div className={haswork ? "home_no" : "home_nowork"}>居然一个作品都没有，你也是够了。。。</div>
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
	      	console.log(data.code);
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


