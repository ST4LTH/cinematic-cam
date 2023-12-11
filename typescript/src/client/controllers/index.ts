export const Init = async (): Promise<void> => {};

import { checkInputRotation, checkInputFov, disableMovement, Delay } from "./utils"

const active = {
    cam: null,
    tick: null,
    obj: null,
}

RegisterCommand("cinematic", async () => {
    if ( active.tick ) { 
        clearTick(active.tick)
        FreezeEntityPosition(PlayerPedId(), false)
        active.tick = null
        return 
    }
    if (!active.cam) {
        let cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
        active.cam = cam
        let [rotx, roty, rotz] = GetGameplayCamRot(5)
        let fov = GetGameplayCamFov()
        let [x, y, z] = GetGameplayCamCoord() 
        let hash = GetHashKey("prop_alien_egg_01")
    
        if (!HasModelLoaded(hash)) {
            RequestModel(hash);
            do {
                await Delay(1)
            } while (!HasModelLoaded(hash));
        }
    
        let [a, b, c] = GetEntityCoords(PlayerPedId(), false)
        let obj = CreateObject(hash, a, b, c, false, false, false)
        active.obj = obj
        RenderScriptCams(true, false, 0, false, false)
        SetEntityCoords(obj, x, y, z, false, false, false, false)
        SetCamRot(cam, rotx, roty, rotz, 5)
        SetCamFov(cam, fov)
        SetEntityHeading(obj, rotz)
        FreezeEntityPosition(obj, true)
        AttachCamToEntity(cam, obj, 0.0, 0.0, 0.0, true)
        SetEntityAlpha(obj, 0, false);
        SetEntityCollision(obj, false, false)
        FreezeEntityPosition(PlayerPedId(), true)
    }
    

    active.tick = setTick(() => {
        let [rv, fv, uv, campos]:any = GetCamMatrix(active.cam)
        checkInputRotation(active.cam)
        checkInputFov(active.cam)
        disableMovement()

        if ( IsDisabledControlPressed(2, 32) ) {
            let setpos = GetEntityCoords(active.obj, false)
            SetEntityCoordsNoOffset(active.obj, setpos[0] + fv[0] * 0.2, setpos[1] + fv[1] * 0.2, setpos[2] + fv[2] * 0.2, false, false, false)
        }
        if ( IsDisabledControlPressed(2, 8) ) {
            let setpos = GetEntityCoords(active.obj, false)
            SetEntityCoordsNoOffset(active.obj, setpos[0] - fv[0] * 0.2, setpos[1] - fv[1] * 0.2, setpos[2] - fv[2] * 0.2, false, false, false)
        }
        if ( IsDisabledControlPressed(2, 30) ) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.1, 0.0, 0.0)
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false)
        }
        if ( IsDisabledControlPressed(2, 34) ) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, -0.1, 0.0, 0.0)
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false)
        }
        if ( IsDisabledControlPressed(2, 44) ) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.0, 0.0, -0.1)
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false)
        }
        if ( IsDisabledControlPressed(2, 38) ) {
            let setpos = GetOffsetFromEntityInWorldCoords(active.obj, 0.0, 0.0, 0.1)
            SetEntityCoordsNoOffset(active.obj, setpos[0], setpos[1], setpos[2], false, false, false)
        }
        let rot = GetCamRot(active.cam, 5)
        SetEntityHeading(active.obj, rot[2])
    })
}, false);

RegisterCommand("offcinematic", async () => { 
    clearTick(active.tick)
    RenderScriptCams(false, true, 1000, false, false)
    DeleteEntity(active.obj)
    FreezeEntityPosition(PlayerPedId(), false)
    active.tick = null
    active.cam = null
    active.obj = null
}, false);

RegisterKeyMapping("cinematic", "Cinematic Camera", 'keyboard', '')
RegisterKeyMapping("offcinematic", "Delete Cinematic Camera", 'keyboard', '')