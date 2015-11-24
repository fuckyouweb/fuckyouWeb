var Pic = React.createClass({
	render:function(){
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src="img/img1_1.jpg" />
				</div>
				<div className="index_container_word">
					<div className="index_container_author">
						<img src="img/roundhead.png" />
					</div>
					<div className="index_container_describe">
						<div className="index_container_boss">boss:</div>
						<div className="index_container_theme">theme:</div>
					</div>
				</div>
			</div>
		)
	}
});

var HotOne = React.createClass({
	render:function(){
		return (
			<div className="index_container_hotone index_container_hot">
			<div className="index_container_hotone_line index_container_line"></div>
			<Pic /><Pic /><Pic />
			</div>
		)
	}
});

var HotTwo = React.createClass({
	render:function(){
		return(
			<div className="index_container_hottwo index_container_hot">
				<div className="index_container_hottwo_line index_container_line"></div>
				<div className="index_container_hottwo_r1"></div>
				<Pic /><Pic /><Pic />
			</div>
		)
	}
});

var HotThree = React.createClass({
	render:function(){
		return(
			<div className="index_container_hotthree index_container_hot">
				<div className="index_container_hotthree_line index_container_line"></div>
				<div className="index_container_hotthree_r1"></div>
				<div className="index_container_hotthree_r2"></div>
				<Pic /><Pic /><Pic />
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
	        this.setState({data: data});
	        console.log('data[0]='+data[0]);
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
    	data.forEach(function(value,index){

    	})
  	},
	render:function(){
		return(
			<div>
				<HotOne /><HotTwo /><HotThree />
			</div>
		)
	}
})

ReactDOM.render(
	<HotContainer url="/api/index"/>,
	document.getElementById('index_hot')
)