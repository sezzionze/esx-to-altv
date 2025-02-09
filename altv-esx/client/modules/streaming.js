import * as alt from 'alt-client';
import * as native from 'natives';

async function requestModel(modelHash) {
    modelHash = typeof modelHash === 'number' ? modelHash : native.getHashKey(modelHash);
    if (!native.hasModelLoaded(modelHash) && native.isModelInCdimage(modelHash)) {
        native.requestModel(modelHash);
        while (!native.hasModelLoaded(modelHash)) {
            await alt.Utils.wait(0);
        }
    }
}

async function requestStreamedTextureDict(textureDict) {
    if (!native.hasStreamedTextureDictLoaded(textureDict)) {
        native.requestStreamedTextureDict(textureDict);
        while (!native.hasStreamedTextureDictLoaded(textureDict)) {
            await alt.Utils.wait(0);
        }
    }
}

async function requestNamedPtfxAsset(assetName) {
    if (!native.hasNamedPtfxAssetLoaded(assetName)) {
        native.requestNamedPtfxAsset(assetName);
        while (!native.hasNamedPtfxAssetLoaded(assetName)) {
            await alt.Utils.wait(0);
        }
    }
}

async function requestAnimSet(animSet) {
    if (!native.hasAnimSetLoaded(animSet)) {
        native.requestAnimSet(animSet);
        while (!native.hasAnimSetLoaded(animSet)) {
            await alt.Utils.wait(0);
        }
    }
}

async function requestAnimDict(animDict) {
    if (!native.hasAnimDictLoaded(animDict)) {
        native.requestAnimDict(animDict);
        while (!native.hasAnimDictLoaded(animDict)) {
            await alt.Utils.wait(0);
        }
    }
}

async function requestWeaponAsset(weaponHash) {
    if (!native.hasWeaponAssetLoaded(weaponHash)) {
        native.requestWeaponAsset(weaponHash);
        while (!native.hasWeaponAssetLoaded(weaponHash)) {
            await alt.Utils.wait(0);
        }
    }
}
