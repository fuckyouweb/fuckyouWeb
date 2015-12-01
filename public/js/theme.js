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
						<img src={head} />
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
			<div className="index_container">
			<div className="index_container_hot">
			<div className="index_container_line"></div>
			{Pics}
			</div>
			</div>
			
		)
	}
});

var HotContainer = React.createClass({
	handlesearch:function(e){
		var searchcontent = this.refs.searchcontent.value.trim();
		$.ajax({
		      url: '/api/themesearch',
		      dataType: 'json',
		      type: 'POST',
		      data: {'searchcontent':searchcontent},
		      success: function(data) {
		      	this.setState({
		      		data:data
		      	})
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }.bind(this)
		    });
	},
	loadFormFromServer:function(){
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache:false,
	      success: function(data) {
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
			<header>
				<ul className='index_head'>
					<li className='index_head_pen'><a href="index.html">PenManBox</a></li>
					<li className='index_head_theme'><a href="theme.html">theme</a></li>
					<li className='index_head_comeon'><a href="comeon.html">来一发</a></li>
					<li className='index_head_home'><a href="home.html">home</a></li>
					<li className="index_log" id="index_log">
						<div>
							<input type="text" placeholder="theme search" className="theme_search" ref="searchcontent"/>
							<div className="theme_searchlogo" id="search" onClick={this.handlesearch}>
								<img src="img/iconfont-search.png" />
							</div>
						</div>
					</li>
				</ul>
			</header>
				<Hot data={this.state.data}/>
			</div>
		)
	}
});

ReactDOM.render(
	<HotContainer url="/api/theme"/>,
	document.getElementById('container')
)