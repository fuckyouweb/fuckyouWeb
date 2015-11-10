##目前遇到的问题与解决方式
###提交表单get与post
在ajax中设置提交方式为post，结果一直执行get，排查后发现后端没问题，问题出在前端，可能情况没有阻止表单默认行为。直接通过表单提交method在react渲染中被屏蔽关键字，解决方式：通过onSubmit方法添加FormData对象，用键值对模拟一个完整的表单，用原生ajax发送。发送二进制文件需要在form中添加enctype="multipart/form-data"


###react传递数据方式
开始时依然采用查找DOM节点，可能会遇到DOM未渲染时状态改变，不能很好的通信，还是采取属性传递，传递后在节点中改变