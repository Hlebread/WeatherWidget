const WeatherWidget = (function(){
	function Controller(){
		let myModel = null;
		let widget  = null;
		let closeCross = null;
		let openArrow = null;

		this.init = function(model, widgetContainer){
			myModel = model;
			widget = widgetContainer;

			this.createWidget();

			widget.addEventListener('click', this.widgetOpen);
			
			closeCross = widget.querySelector('.closeCross');
			closeCross.addEventListener('click', this.widgetClose);
			
			openArrow = widget.querySelector('.openArrow');
			openArrow.addEventListener('click', this.toggleMore);
			openArrow.addEventListener('click', this.makeForecastRequest, {once:true});
			openArrow.addEventListener('click', this.createPreloaderForecast, {once:true});

			this.lockScreen();
			this.askForGeolocation();
		}

		this.createWidget = function(){
			myModel.createWidget();
		}

		this.usePreloader = function(){
			myModel.usePreloader();
		}

		this.hidePreloader = function(){
			myModel.hidePreloader();
		}

		this.askForGeolocation = function(){ //???
			myModel.askForGeolocation();
		}

		this.makeServerRequest = function(){
			myModel.makeServerRequest();
		}

		this.widgetOpen = function(){
			myModel.widgetOpen();
		}

		this.widgetClose = function(e){
			e.stopPropagation();
			myModel.widgetClose();
		}

		this.toggleMore = function(){
			myModel.toggleMore();
		}

		this.makeForecastRequest = function(){
			myModel.makeForecastRequest();
		}

		this.createPreloaderForecast = function(){
			myModel.createPreloaderForecast();
		}

		this.lockScreen = function(){
			myModel.lockScreen();
		}
	};

	function Model(){
		let myView = null;
		let geolocation = null;
		const apiKey = '6ccd239f687fefdccaac2f5aa8ee47d6';
		const apiUrl = 'https://api.openweathermap.org/data/2.5/';
		const defaultCity = '625144';

		this.init = function(view){
			myView = view;
		}

		this.askForGeolocation = function(){ //???
			navigator.geolocation.getCurrentPosition((pos) => {
					this.lockScreen(true);
					geolocation = pos;
					return this.makeServerRequest();
				}, () => {
					this.lockScreen(true);
					this.makeServerRequest();
				});
		}

		this.makeServerRequest = function(){
			let apiQuery = null;
			if(geolocation){
				apiQuery = `${apiUrl}weather?lat=${geolocation.coords.latitude}&lon=${geolocation.coords.longitude}&units=metric&lang=ru&appid=${apiKey}`;
			} else{
				apiQuery = `${apiUrl}weather?id=${defaultCity}&units=metric&lang=ru&appid=${apiKey}`;
			};
			fetch(apiQuery)
				.then(response => response.json())
				.then(data => {
					data.iconLink = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
					data.main.temp = Math.round(data.main.temp);
					this.setWidgetColor(data.weather[0].icon);
					this.fillWidget(data);
				})
				.catch(error => console.error("Ошибка получения погоды. Причина: " + error));
		}

		this.fillWidget = function(data){
			myView.fillWidget(data);
		}
		
		this.makeForecastRequest = function(){
			let apiQuery = null;
			if(geolocation){
				apiQuery = `${apiUrl}forecast?lat=${geolocation.coords.latitude}&lon=${geolocation.coords.longitude}&units=metric&lang=ru&appid=${apiKey}`;
			} else{
				apiQuery = `${apiUrl}forecast?id=${defaultCity}&units=metric&lang=ru&appid=${apiKey}`;
			};

			fetch(apiQuery)
				.then(response => response.json())
				.then(data => {
					this.makeForecast(data.list);
				})
				.catch(error => console.error("Ошибка получения прогноза погоды. Причина: " + error));
		}

		this.makeForecast = function(data){
			const	dNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
			const	months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря', ];
			let date = new Date();
			let forecastData = data.filter( (e) => {
				let dateDay = date.getDate();
				let numPart1 = e.dt_txt.split(' ')[1].split('')[0];
				let numPart2 = e.dt_txt.split(' ')[1].split('')[1];
				let dataDay = e.dt_txt.split(' ')[0].split('-')[2];
				if((dateDay == dataDay && Number(numPart1 + numPart2) > 12) || numPart1+numPart2 === '12'){
					date.setDate(dateDay + 1);
					return e;
				}
			});
			forecastData.map( (e) => {
				let d = new Date(e.dt_txt.split(' ')[0]);
				let elementDate = `${d.getDate()} ${months[d.getMonth()]}`; 
				e.date = elementDate;
				e.main.temp = Math.round(e.main.temp);
			});
			let dayAfterTommorow = dNames[new Date(forecastData[2].dt_txt.split(' ')[0]).getUTCDay() - 1];
			forecastData.dayAfterTommorow = dayAfterTommorow;
			myView.makeForecast(forecastData);
		}

		this.setWidgetColor = function(weather){
			let widgetColor = 'gray';
			switch (weather) {
				case '01d':
					widgetColor = '#46a8a8';
					break;
				case '01n':
					widgetColor = '#a16db7';
					break;
				case '02d':
					widgetColor = '#1f86fc';
					break;
				case '02n':
					widgetColor = '#2b6684';
					break;
				case '03d':
					widgetColor = '#024cb5';
					break;
				case '03n':
					widgetColor = '#012e67';
					break;
				case '04d':
					widgetColor = '#40817a';
					break;
				case '04n':
					widgetColor = '#091d36';
					break;
				case '09d':
					widgetColor = '#666b3a';
					break;
				case '09n':
					widgetColor = '#3b4834';
					break;
				case '10d':
					widgetColor = '#a6b15f';
					break;
				case '10n':
					widgetColor = '#4d5c22';
					break;
				case '11d':
					widgetColor = '#a83b24';
					break;
				case '11n':
					widgetColor = '#561d18';
					break;
				case '13d':
					widgetColor = '#9cacbf';
					break;
				case '13n':
					widgetColor = '#24012f';
					break;
				case '50d':
					widgetColor = '#a8c7cb';
					break;
				case '50n':
					widgetColor = '#2f4c58';						
					break;
	
				default: 
					widgetColor = 'gray';

					break;
			}
			myView.setWidgetColor(widgetColor);
		}

		this.createWidget = function(){
			myView.createWidget();
		}

		this.createPreloaderForecast = function(){
			myView.createPreloaderForecast();
		}

		this.widgetOpen = function(){
			myView.widgetOpen();
		}	

		this.widgetClose = function(){
			myView.widgetClose();
		}

		this.toggleMore = function(){
			myView.toggleMore();
		}

		this.lockScreen = function(del){
			myView.toggleOverlay(del);
		}
	};

	function View(){
		let widget = null;
		let overlay = null;
		let preloaderMain = null;
		let preloaderForecast = null;
		let closeCross = null
		let leftContainer = null;
		let locationBlock = null;
		let temperatureBlock = null;
		let rightContainer = null;
		let iconBlock = null;
		let weatherTextBlock = null;
		let arrowOpen = null;
		let arrowOpenArrow = null;
		let forecast = null;
		let forecastToday = null;
		let forecastTommorow = null;
		let forecastDayAfterTommorow = null;

		let dataa = {
			date: 'date',
			dName: 'dayName',
			icon: 'clouds',
			temp: 30,
		};

		this.init = function(widgetContainer){
			widget = widgetContainer;
		}

		this.createWidget = function(){
			widget.classList.add('weather_widget');

			closeCross = document.createElement('span');
			closeCross.classList.add('closeCross');
			closeCross.textContent = '\u00d7';
			widget.append(closeCross);

			leftContainer = document.createElement('section');
			leftContainer.classList.add('container');
			leftContainer.classList.add('left_container');
			widget.append(leftContainer);

			rightContainer = document.createElement('section');
			rightContainer.classList.add('container');
			rightContainer.classList.add('right_container');
			widget.append(rightContainer);

			arrowOpen = document.createElement('section');
			arrowOpen.classList.add('openArrow');
			arrowOpenArrow = document.createElement('i');
			arrowOpen.append(arrowOpenArrow);
			widget.append(arrowOpen);

			locationBlock = document.createElement('section');
			locationBlock.classList.add('location');
			leftContainer.append(locationBlock);

			temperatureBlock = document.createElement('section');
			temperatureBlock.classList.add('temperature');
			leftContainer.append(temperatureBlock);
			
			iconBlock = document.createElement('section');
			iconBlock.classList.add('icon');
			rightContainer.append(iconBlock);

			weatherTextBlock = document.createElement('section');
			weatherTextBlock.classList.add('weather_text');
			rightContainer.append(weatherTextBlock);

			forecast = document.createElement('section');
			forecast.classList.add('forecast');
			widget.append(forecast);

			document.body.append(widget);

			this.createPreloaderMain();
		}

		this.toggleOverlay = function(del){
			if(del){
				overlay.remove();
				return;
			};
			overlay = document.createElement('div');
			overlay.classList.add('weather_widget_overlay');
			document.body.append(overlay);
		}
		
		this.createPreloaderMain = function(){
			preloaderMain = document.createElement('div');
			preloaderMain.classList.add('preloader');
			widget.append(preloaderMain);
		}
		
		this.createPreloaderForecast = function(){
			preloaderForecast = document.createElement('div');
			preloaderForecast.classList.add('preloader');
			forecast.append(preloaderForecast);
		}

		this.togglePreloader = function(preloader){
			preloader.classList.toggle('toggle');
		}

		this.fillWidget = function(data){
			widget.style.backgroundImage = `url(${data.iconLink})`;
			
			locationBlock.textContent = data.name;
			temperatureBlock.textContent = `${data.main.temp}\u00b0C`;
			let img = new Image();
			img.src = data.iconLink;
			iconBlock.append(img);
			weatherTextBlock.textContent = data.weather[0].description;
			this.togglePreloader(preloaderMain);
		}

		this.setWidgetColor = function(color){
			widget.style.setProperty('--widget-color', color)
		}

		this.widgetOpen = function(){
			widget.classList.add('widget_open');
		}

		this.widgetClose = function(){
			if(widget.classList.contains('more_open')){
				widget.classList.toggle('more_open');
			};
			widget.classList.remove('widget_open');
		}

		this.toggleMore = function(){
			widget.classList.toggle('more_open');
		}

		this.makeForecast = function(data) {
			const forecastDays = [forecastToday, forecastTommorow, forecastDayAfterTommorow];
			forecastDays.forEach( (e, i) => {
				let imgUrl = `http://openweathermap.org/img/wn/${data[i].weather[0].icon}.png`;
				let day;
				if(i === 0){
					day = 'Сегодня';
				} else if(i === 1){
					day = 'Завтра';
				} else{
					day = data.dayAfterTommorow;
				}
				let inner = `<div><div>${data[i].date}</div><span>${day}</span></div><div><img src="${imgUrl}"></img></div><div>${data[i].main.temp}\u00b0C</div>`;
				e = document.createElement('section');
				e.classList.add('forecast_day');
				if(i === i){
					e.innerHTML = inner;
				};
				forecast.append(e);
			});
			this.togglePreloader(preloaderForecast);
		}
	};

	return {
		getWeather: function(){
			const widgetContainer = document.createElement('article');

			const weatherWidgetView = new View();
			const weatherWidgetModel = new Model();
			const weatherWidgetController = new Controller();

			weatherWidgetView.init(widgetContainer);
			weatherWidgetModel.init(weatherWidgetView);
			weatherWidgetController.init(weatherWidgetModel, widgetContainer);
		},

		help: function(){
			console.log(`Для подключения виджета импортируйте файл стилей и файл со скриптом: \n
							<link rel="stylesheet" href="WeatherWidget_styles.css" type="text/css"\n>
							<script src = 'WeatherWidget.js'></script>`);
		},
	}
}());
// const widget = new WeatherWidget.getWeather();