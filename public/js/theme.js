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
		var Pics = this.props.data.map(function(value,index){
			return (
				<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo}/>
			);
		});
		return (
			<div className="index_container_hot">
			<div className="index_container_line"></div>
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
	      	//console.log('data='+data);
	        this.setState({
	        	data:data
	        });
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

var Search = React.createClass({
	handlesearch:function(e){
		var searchcontent = this.refs.searchcontent.value.trim();
		$.ajax({
		      url: '/api/themesearch',
		      dataType: 'json',
		      type: 'POST',
		      data: {'searchcontent':searchcontent},
		      success: function(data) {
		      	console.log(data);
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},

	render:function(){
		return(
			<div>
				<input type="text" placeholder="theme search" className="theme_search" ref="searchcontent"/>
				<div className="theme_searchlogo" id="search" onClick={this.handlesearch} >
					<img src="img/iconfont-search.png" />
				</div>
			</div>
		)
	}
});

ReactDOM.render(
	<Search />,
	document.getElementById('index_log')
)

ReactDOM.render(
	<HotContainer url="/api/theme"/>,
	document.getElementById('index_hot')
)