import * as alt from 'alt-client';
import * as native from 'natives';

function requestScaleformMovie(movie) {
    return new Promise((resolve) => {
        const scaleform = native.requestScaleformMovie(movie);
        const interval = alt.setInterval(() => {
            if (native.hasScaleformMovieLoaded(scaleform)) {
                alt.clearInterval(interval);
                resolve(scaleform);
            }
        }, 0);
    });
}

async function showFreemodeMessage(title, msg, sec) {
    const scaleform = await requestScaleformMovie('MP_BIG_MESSAGE_FREEMODE');
    native.beginScaleformMovieMethod(scaleform, 'SHOW_SHARD_WASTED_MP_MESSAGE');
    native.scaleformMovieMethodAddParamTextureNameString(title);
    native.scaleformMovieMethodAddParamTextureNameString(msg);
    native.endScaleformMovieMethod();
    
    while (sec > 0) {
        await alt.Utils.wait(10);
        sec -= 0.01;
        native.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255);
    }
    native.setScaleformMovieAsNoLongerNeeded(scaleform);
}

async function showBreakingNews(title, msg, bottom, sec) {
    const scaleform = await requestScaleformMovie('BREAKING_NEWS');
    native.beginScaleformMovieMethod(scaleform, 'SET_TEXT');
    native.scaleformMovieMethodAddParamTextureNameString(msg);
    native.scaleformMovieMethodAddParamTextureNameString(bottom);
    native.endScaleformMovieMethod();

    native.beginScaleformMovieMethod(scaleform, 'SET_SCROLL_TEXT');
    native.scaleformMovieMethodAddParamInt(0);
    native.scaleformMovieMethodAddParamInt(0);
    native.scaleformMovieMethodAddParamTextureNameString(title);
    native.endScaleformMovieMethod();

    native.beginScaleformMovieMethod(scaleform, 'DISPLAY_SCROLL_TEXT');
    native.scaleformMovieMethodAddParamInt(0);
    native.scaleformMovieMethodAddParamInt(0);
    native.endScaleformMovieMethod();
    
    while (sec > 0) {
        await alt.Utils.wait(10);
        sec -= 0.01;
        native.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255);
    }
    native.setScaleformMovieAsNoLongerNeeded(scaleform);
}

async function showPopupWarning(title, msg, bottom, sec) {
    const scaleform = await requestScaleformMovie('POPUP_WARNING');
    native.beginScaleformMovieMethod(scaleform, 'SHOW_POPUP_WARNING');
    native.scaleformMovieMethodAddParamFloat(500.0);
    native.scaleformMovieMethodAddParamTextureNameString(title);
    native.scaleformMovieMethodAddParamTextureNameString(msg);
    native.scaleformMovieMethodAddParamTextureNameString(bottom);
    native.scaleformMovieMethodAddParamBool(true);
    native.endScaleformMovieMethod();
    
    while (sec > 0) {
        await alt.Utils.wait(10);
        sec -= 0.01;
        native.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255);
    }
    native.setScaleformMovieAsNoLongerNeeded(scaleform);
}

async function showTrafficMovie(sec) {
    const scaleform = await requestScaleformMovie('TRAFFIC_CAM');
    native.beginScaleformMovieMethod(scaleform, 'PLAY_CAM_MOVIE');
    native.endScaleformMovieMethod();
    
    while (sec > 0) {
        await alt.Utils.wait(10);
        sec -= 0.01;
        native.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255);
    }
    native.setScaleformMovieAsNoLongerNeeded(scaleform);
}
