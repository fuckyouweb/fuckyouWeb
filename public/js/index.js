var Pic = React.createClass({
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = this.props.photo;
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
		var Pics = this.props.data.map(function(value,index){
			return (
				<Pic name={value.name} theme={value.theme} head={value.head} photo={value.photo}/>
			);
		});
		return (
			<div className="index_container_hot">
			<div className="index_container_line"></div>
			<div className="index_container_hot_r"></div>
			<div className="index_container_hot_r1"></div>
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
	      	console.log('date='+data);
	      	console.log('data2='+data.data2);
	        this.setState({
	        	data1:data.data1,
	        	data2:data.data2,
	        	data3:data.data3
	        });
	        console.log('data1='+data.data1[0].photo);
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	getInitialState:function(){
		return {data1:[],data2:[],data3:[]}
	},
	componentDidMount: function() {
    	this.loadFormFromServer();
  	},
	render:function(){
		return(
			<div>
				<Hot data={this.state.data1}/>
				<Hot data={this.state.data2}/>
				<Hot data={this.state.data3}/>
			</div>
		)
	}
})

ReactDOM.render(
	<HotContainer url="/api/index"/>,
	document.getElementById('index_hot')
)