var promiseDemo = (function(){

	/*
		This example is showing the callback method
	*/
	var makeRequest = function(callback){
		var ajaxRequest = new XMLHttpRequest();
		ajaxRequest.addEventListener("load", function(){
			console.log('response:', this.response);
			if(this.status !== 200){
				return callback(new Error('Error Occured'));
			}
			return callback(null, this.response);
		});
		ajaxRequest.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
		ajaxRequest.send();
	};


	/*
		This example is showing the promises method
	*/
	var promiseRequest = function(){
		var promise1 = new Promise(function(resolve, reject){
			var ajaxRequest = new XMLHttpRequest();
			ajaxRequest.addEventListener("load", function(){
				//console.log('Promise reposne response:', this.response);
				if(this.status === 200){
					resolve(this);
				} else {
					reject(this);
				}
			});
			ajaxRequest.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
			ajaxRequest.send();
		});
		return promise1;
	};

	var getPromise1 = function(){
		var promise1 = new Promise(function(resolve, reject){
			var ajaxRequest = new XMLHttpRequest();
			ajaxRequest.addEventListener("load", function(){
				//console.log('Promise reposne response:', this.response);
				if(this.status === 200){
					resolve(this);
				} else {
					reject(this);
				}
			});
			ajaxRequest.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
			ajaxRequest.send();
		});
		return promise1;
	};

	var getPromise2 = function(){
		var promise1 = new Promise(function(resolve, reject){
			var ajaxRequest = new XMLHttpRequest();
			ajaxRequest.addEventListener("load", function(){
				//console.log('Promise reposne response:', this.response);
				if(this.status === 200){
					resolve(this);
				} else {
					reject(this);
				}
			});
			ajaxRequest.open("GET", "https://jsonplaceholder.typicode.com/posts/2");
			ajaxRequest.send();
		});
		return promise1;
	};

	var getPromise3 = function(){
		var promise1 = new Promise(function(resolve, reject){
			var ajaxRequest = new XMLHttpRequest();
			ajaxRequest.addEventListener("load", function(){
				//console.log('Promise reposne response:', this.response);
				if(this.status === 200){
					resolve(this);
				} else {
					reject(this);
				}
			});
			ajaxRequest.open("GET", "https://jsonplaceholder.typicode.com/posts/3");
			ajaxRequest.send();
		});
		return promise1;
	};


	return {
		//Demonstrates the callback
		getPostsCallback: function(callback){
			makeRequest(callback);
		},

		//Demonstrates the single promise.
		promiseDemo: function(callback){
			promiseRequest().then(function(result){
			   //console.log('Promise reposne:', result.response);
			   document.getElementById("promise-response").innerHTML = result.response;
			}, function(error){
				console.log('error:', error);
			});
		},

		//Demonstrates the multiple promises scenerios.
		simulateAllPromise: function(){
			console.log('simulateAllPromise');
			var promise1 = getPromise1(), 
				promise2 = getPromise2(),
				promise3 = getPromise3();

			Promise.all([promise1, promise2, promise3]).then(function(results){
				console.log('results:', results);
				results.forEach(function(eachResponse){
					console.log('eachResponse:', eachResponse.response);
				});
			});
		},

		simulatePromiseChaining: function(){
			console.log('simulatePromiseChaining');
			var promise1 = getPromise1(), 
				promise2 = getPromise2(),
				promise3 = getPromise3();
				

			promise1.then(function(result){
			    console.log('promise 1 result:', result);
				return promise2;
			}, function(error){
			   console.log('error promise 1:', error);
			}).then(function(result){
				console.log('promise 2 result:', result);
				return promise3;
			}, function(error){
				console.log('error promise 2:', error);
			}).then(function(result){
				console.log('promise 3 result:', result);
			}, function(){
				console.log('promise 3 error', result);
			});
		}
	};
})();

/*

*/