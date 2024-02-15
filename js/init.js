function _init() {
    AdHandler.init()
}

function showAd()
{
    AdHandler.showAd(h5ads.AdType.interstitial);
}
// this function will be called from canvas on gamestart
function onGameLoaded()
{
    console.log("<Game Loaded>");
    AdHandler.isGameLoaded = true;
    // c2AdInstance.isGameLoaded = true;
}
function onGameEnd()
{
    console.log("<Game Ended>");
    _sendPortalEvent();
}

function _sendPortalEvent() {
    if (window.hasOwnProperty('gdsdk')) {
        try {
            const data = _getScoreAndLevel();
            console.log('DEBUG: sending events for lagged', data.levelNumber, data.score);
            window.gdsdk.sendEvent( {eventName: 'game_event', data: {level: data.levelNumber, event: 'lagged_total_score', score: data.score}} );
        } catch (e) {
            console.log(`Could not send Lagged event: ${e}`);
        }
    }
}

function _saveProgForEvents(key, score){
    if (key !== 'hs_xp') {
        return;
    }
    const namespace = 'hs_prg_sg';
    try {
        let data = localStorage.getItem(namespace);
        if(!data) {
            localStorage.setItem(namespace, score);
        } else {
            let parsedScore = JSON.parse(data);
            if (score > parsedScore) {
                localStorage.setItem(namespace, score);
            }
        }
    } catch(e){
        console.log('Could not save score');
    }
}

function _saveLevelForEvents(level){
    const namespace = 'hs_lv_sg';
    let levelNr = 1;
    try {
        levelNr = level.split(' ')[1];
        let data = localStorage.getItem(namespace);
        if(!data) {
            localStorage.setItem(namespace, levelNr);
        }
    } catch(e){
        console.log('Could not save level');
    }
}

function _getScoreAndLevel() {
    //saving and restoring as two separate namespaces for now, testing what the portal wants saved and tracked
    // this way removing one later on won't affect whatever prototype goes live
    const scoreNamespace = 'hs_prg_sg';
    const levelNamespace = 'hs_lv_sg';
    let score = 0;
    let levelNumber = 1;
    try {
        let scoreData = localStorage.getItem(scoreNamespace);
        let levelData = localStorage.getItem(levelNamespace);
        if(scoreData) {
            score = JSON.parse(scoreData);
        }
        if(levelData) {
            levelNumber = JSON.parse(levelData);
        }
    } catch(e){
        console.log('Could not get score');
    }

    return {
        score, levelNumber
    };
}

_init();