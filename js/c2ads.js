

var AdProviders = {"Pandora":0, "Wechat":1, "SmInstant":2, "GameDistribution": 3};
var AdType = {"interstitial":0, "rewarded":1}

var c2Ads = (function (gameId,adProvider) {

	this.logPrefix = "<c2AdConnector>";
	this.adProviderInstance;
	this.isReady = false;
	this.bannerActive = false;
	this.isGameLoaded = false;

	c2Ads.prototype.init = function (){
		console.log(this.logPrefix + gameId, adProvider);

		if(adProvider===AdProviders.Pandora)
			this.adProviderInstance = new PandoraAdProvider(gameId,this,0);
		
		if(adProvider===AdProviders.Wechat)
			this.adProviderInstance = new WechatAdprovider(this);
		
		if(adProvider===AdProviders.SmInstant)
			this.adProviderInstance = new SmInstantAdProvider(gameId,this);

		if(adProvider===AdProviders.GameDistribution)
			this.adProviderInstance = new GameDistributionAds(gameId,this);

	};

	c2Ads.prototype.showAd = function (adType){
		if(this.isReady)
		{
			console.log(this.logPrefix + "Ads Shown", adProvider, adType);
			if(adProvider===AdProviders.Pandora)
				this.adProviderInstance.showAd(adType);
			

			if(adProvider===AdProviders.Wechat)
				this.adProviderInstance.showAd();
	
			if(adProvider===AdProviders.SmInstant)
				this.adProviderInstance.showAd(adType);

			if(adProvider===AdProviders.GameDistribution)
				this.adProviderInstance.showAd(adType);
		}
		else
		{
			console.warn(this.logPrefix + "Cannot show ads [SDK not ready]");
			this.onGameResumed();
		}
	};

	c2Ads.prototype.preloadAd - function (){
		console.log(this.logPrefix + "Preloading Ads");
		if(adProvider===AdProviders.Pandora)
			this.adProviderInstance.preloadAd(adType);

		if(adProvider===AdProviders.Wechat)
		{
			var adUnitId = "xxxxxx";
			this.adProviderInstance.preloadAd(adUnitId);
		}

		if(adProvider===AdProviders.SmInstant)
			this.adProviderInstance.preloadAd(adType);

	};

	c2Ads.prototype.onGameResumed = function (){
		console.log(this.logPrefix + "Game Resumed");
		if(this.isGameLoaded)
		{
			c2_callFunction("On_GameResumed");

		}
	};
	c2Ads.prototype.onGamePaused= function (){
		console.log(this.logPrefix + "Game Paused");
		if(this.isGameLoaded)
		{
			c2_callFunction("On_GamePaused");
		}
	};

	c2Ads.prototype.onAdRewardGranted = function (){
		console.log(this.logPrefix + "On Ad Rewarded");
		if(this.isGameLoaded)
		{
			c2_callFunction("On_AdRewardGranted");
		}
	};

	this.init();

});





