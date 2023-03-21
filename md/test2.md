# 一个简单的JSON 解析器1239
这是一个很简单，高效的JSON 解析和操作的组件。它不依赖其它的组件，在一些轻度使用的JSON的场景非常适用。
## 快还开始
![desc](md/images/aaaae1f7ad1c42968e2567095fa1f56b.png "desc")
![desc](md/images/a3d00d05559a43feaac27892810e6b19.png "desc")''

![desc](md/images/2f73f79e76884e2fbaaf7ce2e446552a.png "desc")
![desc](md/images/caffd73d34b94b2f81f8f0d6c4ba6f89.png "desc")
```
String js = "{\"name\":\"eric\",\"profile\":{\"company\":\"tylw\",\"birthday\":\"1984-05-17\"},\"data\":[1,2,3,4,5,6,7.9]}";

        Json json = Json.parse(js);
		//设置
        json.set("js[0]", new Date());
        json.set("js[1]", new Date().getTime());
        System.out.println(json);
		
		//读取值
        System.out.println(json.Q("name").asString());
        System.out.println(json.Q("profile"));
        System.out.println(json.Q("profile.company").getRaw());
        System.out.println(json.Q("profile.company"));
        System.out.println(json.Q("profile.company").asString());
        System.out.println(json.Q("profile.company").asDate());
        System.out.println(json.Q("profile.birthday").asDate());
        System.out.println(json.Q("data[6]").asDate());
		System.out.println(json.Q("data[1]").asInt());
		
		//移除值
        json.remove("profile");
        System.out.println(json);
		
		//转为JSON string
		String jsonString =json.toString();
		 System.out.println(jsonString);
		
		
```