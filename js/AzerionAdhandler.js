var AdHandler = (function () {
    function AdHandler() {
    }
    AdHandler.init = function () {
        this.isGameLoaded = false;
        let adType = window['_azerionIntegration']['advType'];
        let gdId = window['_azerionIntegration']['gdId'];
        this.azAdWrapper = new window['h5ads']['AdWrapper'](adType, gdId);

        this.addListeners();

    };

    AdHandler.addListeners = function () {
        this.azAdWrapper.on(h5ads.AdEvents.CONTENT_PAUSED, () => {
            LoaderHelper.hide();
            if (this.isGameLoaded) {
                c2_callFunction("On_GamePaused");
            }

        });

        this.azAdWrapper.on(h5ads.AdEvents.CONTENT_RESUMED, () => {
            LoaderHelper.hide();
            if (this.isGameLoaded) {
                c2_callFunction("On_GameResumed");

            }
        });
    }

    AdHandler.showAd = function (type, resumeCallback, $adType) {
        let adType = $adType ? $adType : h5ads.AdType.interstitial;
        LoaderHelper.show();

        if (adType === h5ads.AdType.rewarded) {
            this.azAdWrapper.once(h5ads.AdEvents.AD_REWARDED, () => {
                console.log('Rewarded == true');
                this.rewarded = true;
            });
        }

        let onAdCompleted = () => {
            if (adType === h5ads.AdType.rewarded) {
                this.azAdWrapper.preloadAd(h5ads.AdType.rewarded);
            }

            if (resumeCallback) {
                resumeCallback();
            }
            this.azAdWrapper.removeAllListeners(h5ads.AdEvents.AD_REWARDED);
            this.azAdWrapper.removeListener(h5ads.AdEvents.CONTENT_RESUMED, onAdCompleted);
        }
        this.azAdWrapper.on(h5ads.AdEvents.CONTENT_RESUMED, onAdCompleted);

        this.azAdWrapper.showAd(adType);
    };
    AdHandler.adAvailable = function () {
        return this.azAdWrapper.adsEnabled() &&  this.azAdWrapper.adAvailable(h5ads.AdType.rewarded);
    }

    AdHandler.preloadAd = function () {
        this.azAdWrapper.preloadAd(h5ads.AdType.rewarded);
    }

    AdHandler.isRewarded = function () {
        return this.rewarded;
    }

    AdHandler.toggleRewarded = function (enable) {
        this.rewarded = enable;
    }
    return AdHandler;
}());