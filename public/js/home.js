var Pic = React.createClass({
	handleDelete:function(){
		if(confirm('Are you sure to delete?!!')){
			var workid = this.props.containID;
			$.ajax({
		      url: '/api/home/deletework',
		      dataType: 'json',
		      type: 'POST',
		      data:{'workid':workid},
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
	handleUpdateClose:function(){
		this.setState({data :{ 'display':'0'}});
		console.log('1111==='+this.state.data.display);
	},
	handleUpdate:function(){
		this.setState({data :{ 'display':'1'}});
		console.log('this.state.data.display='+this.state.data.display);
		var id = this.props.containID;
		var theme = this.props.theme;
		var describe = this.props.describe;
		var updateAdd = {
			'id':id,
			'display':this.state.data.display
		};
		var dom_container = document.getElementById("home_updateshow_"+id);
		ReactDOM.render(
			<UpdataShow updateAdd={updateAdd} key={id} handleclose={this.handleUpdateClose}/>,
			dom_container
		)
	},
	getInitialState:function(){
		return {data:{'display':'1'}};
	},
	
	render:function(){
		var name = this.props.name;
		var theme = this.props.theme;
		var head = this.props.head;
		var photo = 'authorphoto/'+this.props.photo;
		var id = this.props.containID;
		var show = +this.state.data.display;
		console.log('show='+show);
		return (
			<div className="index_container_picwrap">
				<div className="index_container_pic">
					<img src={photo} />
				</div>
				<div className="index_container_word">
					<div className="index_container_describe">
						<div className="index_container_theme">theme:{theme}</div>
						<div className="home_button">
							<div className="home_delete" id={id} onClick={this.handleDelete}>删除</div>
							<div className="home_update" id={id} onClick={this.handleUpdate}>修改</div>
						</div>
					</div>
				</div>
				<UpdateContainer show={show} container={id}/>
			</div>
		)
	}
});

var UpdateContainer = React.createClass({
	render:function(){
		var show = this.props.show;
		console.log('conshow='+show);
		var dom_id  = "home_updateshow_" + this.props.container;
		//if(!show)
			return (<div id={dom_id}></div>);
		//else
		//	return	(<div></div>);
	}
})

var UpdataShow = React.createClass({
	handleSubmit:function(e){
		e.preventDefault();
		var theme = this.refs.theme.value.trim();
		var describe= this.refs.describe.value.trim();
		var id = this.props.updateAdd.id;
		var form = {
			'theme':theme,
			'describe':describe,
			'id':id
		};
		$.ajax({
	      url: '/api/home/updatework',
	      dataType: 'json',
	      type: 'POST',
	      data:form,
	      success: function(data) {
	      	if(data.code == 1){
	      		alert('update success!');
	      		window.location.reload();
	      	}
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	handleCloseClick: function () {
		this.setState({data:{display:0}});
		//$("#home_updateshow_"+this.props.updateAdd.id).html("")
		var a = this.getDOMNode();
		console.dir(a);
	},
	getInitialState: function () {
		return{data:{display:this.props.updateAdd}}
	},
	render:function(){
		return(
			<div className={this.state.data.display?"home_updateshow":"home_updateshow_close"}>
			<form onSubmit={this.handleSubmit}>
				<div className="home_theme">theme:</div>
				<input type='text' className="home_themeinput" ref="theme"/>
				<div className="home_describe">describe:</div>
				<textarea className="home_describeinput" ref="describe">
				</textarea>
				<button type='submit' className="home_submit">ok!</button>
			</form>
			<div className="home_updateclose" onClick={this.handleCloseClick}>x</div>
			</div>
		)
	}
})

var AuthorInfo = React.createClass({
	handleChangeHead:function(){
		alert("功能尚未开启，你还是先当一只狗吧～");
	},
	render:function(){
		var haswork = this.props.haswork;
		if(haswork)
			return (
				<div className="home_anthorinfo">
				<div className="home_head">
					<img src="head/penmanbox_dog.png"/>
				</div>
				<div className="home_changehead" onClick={this.handleChangeHead}>换头</div>
				<div className="index_container_line" ></div>
			</div>
			);
		else
		return(
			<div className="home_anthorinfo">
				<div className="home_nowork">居然一个作品都没有，你也是够了。。。</div>
			</div>
		)
	}
})

var Hot = React.createClass({
	render:function(){
		var haswork = this.props.data.length;
		if(haswork){
			var Pics = this.props.data.map(function(value,index){
				return (
					<Pic key={index} name={value.username} theme={value.theme} head={value.head} photo={value.photo} containID={value._id} describe={value.describe}/>
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


