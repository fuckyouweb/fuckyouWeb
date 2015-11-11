//require('nunjucks');
// 包装函数
module.exports = function(grunt){
	
	//任务配置，所有插件的配置信息
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		raml2html: {
		    all: {
		      options: {
		      	separator: ': ',
        		punctuation: ' !!!'
		        //mainTemplate: 'template.nunjucks',
        		//templatesPath: '' 
		      },
		      files: {
		        'dest/api.html': ['penmanbox.raml'], 
		      }
		    }
		  },

		// uglify:{
		// 	options:{
		// 		stripBanners:true,
		// 		banner:'/*!<%=pkg.name%>-<%=pkg.version%>.js <%=grunt.template.today("yyyy-mm-dd")%> */\n'			
		// 	},
		// 	build:{
		// 		src:'src/test.js',
		// 		dest:'build/<%=pkg.name%>-<%=pkg.version%>.js.min.js'
		// 	}
		// },

		// jshint:{
		// 	build:['Gruntfile.js','src/*.js'],
		// 	options:{
		// 		jshintrc:'.jshintrc'
		// 	}
		// },

		// watch:{
		// 	build:{
		// 		files:['src/*.js'],
		// 		tasks:['jshint'],
		// 		options:{spawn:false}
		// 	}
		// }
	});

	//告诉grunt我们将使用插件
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-raml2html');

	//告诉grunt当我们在终端中输入grunt时需要做些什么（注意先后顺序）
	//grunt.registerTask('default',['jshint','uglify','watch']);
	grunt.registerTask('default',['raml2html']);

}; 
