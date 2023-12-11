/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/client.ts":
/*!******************************!*\
  !*** ./src/client/client.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Controllers = __importStar(__webpack_require__(/*! ./controllers/index */ "./src/client/controllers/index.ts"));
(async () => {
    await Controllers.Init();
})();


/***/ }),

/***/ "./src/client/controllers/index.ts":
/*!*****************************************!*\
  !*** ./src/client/controllers/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Init = void 0;
const Init = async () => { };
exports.Init = Init;
const utils_1 = __webpack_require__(/*! ./utils */ "./src/client/controllers/utils.ts");
const active = {
    cam: null,
    tick: null,
    obj: null,
};
RegisterCommand("cinematic", async () => {
    if (active.tick) {
        clearTick(active.tick);
        FreezeEntityPosition(PlayerPedId(), false);
        active.tick = null;
        return;
    }
    if (!active.cam) {
        let cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
        active.cam = cam;
        let [rotx, roty, rotz] = GetGameplayCamRot(5);
        let fov = GetGameplayCamFov();
        let [x, y, z] = GetGameplayCamCoord();
        let hash = GetHashKey("prop_alien_egg_01");
        if (!HasModelLoaded(hash)) {
            RequestModel(hash);
            do {
                await (0, utils_1.Delay)(1);
            } while (!HasModelLoaded(hash));
        }
        let [a, b, c] = GetEntityCoords(PlayerPedId(), false);
        let obj = CreateObject(hash, a, b, c, false, false, false);
        active.obj = obj;
        RenderScriptCams(true, false, 0, false, false);
        SetEntityCoords(obj, x, y, z, false, false, false, false);
        SetCamRot(cam, rotx, roty, rotz, 5);
        SetCamFov(cam, fov);
        SetEntityHeading(obj, rotz);
        FreezeEntityPosition(obj, true);
        AttachCamToEntity(cam, obj, 0.0, 0.0, 0.0, true);
        SetEntityAlpha(obj, 0, false);
        SetEntityCollision(obj, false, false);
        FreezeEntityPosition(PlayerPedId(), true);
    }
    active.tick = setTick(() => {
        let [rv, fv, uv, campos] = GetCamMatrix(active.cam);
        (0, utils_1.checkInputRotation)(active.cam);
        (0, utils_1.checkInputFov)(active.cam);
        (0, utils_1.disableMovement)();
        if (IsDisabledControlPressed(2, 32)) {
            let setpos = GetEntityCoords(active.obj, false);
            SetEntityCoordsNoOffset(active.obj, setpos[0] + fv[0] * 0.2, setpos[1] + fv[1] * 0.2, setpos[2] + fv[2] * 0.2, false, false, false);
        }
        if (IsDisabledControlPressed(2, 8)) {
            let setpos = GetEntityCoords(active.obj, false);
            SetEntityCoordsNoOffset(active.obj, setpos[0] - fv[0] * 0.2, setpos[1] - fv[1] * 0.2, setpos[2] - fv[2] * 0.2, false, false, false);
        }
        if (IsDisabledControlPressed(2, 30)) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.1, 0.0, 0.0);
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false);
        }
        if (IsDisabledControlPressed(2, 34)) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, -0.1, 0.0, 0.0);
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false);
        }
        if (IsDisabledControlPressed(2, 44)) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.0, 0.0, -0.1);
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false);
        }
        if (IsDisabledControlPressed(2, 38)) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.0, 0.0, 0.1);
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false);
        }
        let rot = GetCamRot(active.cam, 5);
        SetEntityHeading(active.obj, rot[2]);
    });
}, false);
RegisterCommand("offcinematic", async () => {
    clearTick(active.tick);
    RenderScriptCams(false, true, 1000, false, false);
    DeleteEntity(active.obj);
    FreezeEntityPosition(PlayerPedId(), false);
    active.tick = null;
    active.cam = null;
    active.obj = null;
}, false);
RegisterKeyMapping("cinematic", "Cinematic Camera", 'keyboard', '');
RegisterKeyMapping("offcinematic", "Delete Cinematic Camera", 'keyboard', '');


/***/ }),

/***/ "./src/client/controllers/utils.ts":
/*!*****************************************!*\
  !*** ./src/client/controllers/utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.disableMovement = exports.checkInputFov = exports.checkInputRotation = exports.Delay = void 0;
const Delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.Delay = Delay;
// rotates camera
const checkInputRotation = (cam) => {
    let rightAxisX = GetDisabledControlNormal(0, 220);
    let rightAxisY = GetDisabledControlNormal(0, 221);
    let [z, y, x] = GetCamRot(cam, 0);
    if (rightAxisX !== 0.0 || rightAxisY !== 0.0) {
        let rotx = x + rightAxisX * -4;
        let roty = z + rightAxisY * -4;
        SetCamRot(cam, roty, 0.0, rotx, 0);
    }
};
exports.checkInputRotation = checkInputRotation;
const fov_min = 10;
const fov_max = 120;
const checkInputFov = (cam) => {
    let fov = GetCamFov(cam);
    if (IsControlJustPressed(0, 241)) {
        fov = Math.max(fov - 5, fov_min);
    }
    if (IsControlJustPressed(0, 242)) {
        fov = Math.min(fov + 5, fov_max);
    }
    SetCamFov(cam, fov);
};
exports.checkInputFov = checkInputFov;
const disableMovement = () => {
    DisableControlAction(2, 1, true);
    DisableControlAction(2, 2, true);
    DisableControlAction(2, 106, true);
    DisableControlAction(2, 142, true);
    DisableControlAction(2, 30, true);
    DisableControlAction(2, 31, true);
    DisableControlAction(2, 21, true);
    DisableControlAction(2, 24, true);
    DisableControlAction(2, 25, true);
    DisableControlAction(2, 47, true);
    DisableControlAction(2, 58, true);
    DisableControlAction(2, 263, true);
    DisableControlAction(2, 264, true);
    DisableControlAction(2, 257, true);
    DisableControlAction(2, 140, true);
    DisableControlAction(2, 141, true);
    DisableControlAction(2, 143, true);
    DisableControlAction(2, 75, true);
    DisableControlAction(27, 75, true);
    DisableControlAction(2, 23, true);
    DisableControlAction(2, 75, true);
    DisableControlAction(2, 32, true);
    DisableControlAction(2, 34, true);
    DisableControlAction(2, 33, true);
    DisableControlAction(2, 35, true);
    DisableControlAction(2, 71, true);
    DisableControlAction(2, 72, true);
    DisableControlAction(2, 78, true);
    DisableControlAction(2, 79, true);
};
exports.disableMovement = disableMovement;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/client.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=client.js.map