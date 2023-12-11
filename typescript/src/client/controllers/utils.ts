
export const Delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// rotates camera
export const checkInputRotation = (cam:any) => {
    let rightAxisX:number = GetDisabledControlNormal(0, 220);
    let rightAxisY:number = GetDisabledControlNormal(0, 221);
    let [z, y, x]:any = GetCamRot(cam, 0);
    
    if (rightAxisX !== 0.0 || rightAxisY !== 0.0) {
        let rotx= x + rightAxisX * -4
        let roty= z + rightAxisY * -4
        SetCamRot(cam, roty, 0.0, rotx, 0);
    }
}

const fov_min = 10
const fov_max = 120

export const checkInputFov = (cam:any) => {
    let fov = GetCamFov(cam);

    if (IsControlJustPressed(0, 241)) {
        fov = Math.max(fov - 5, fov_min);
    }
    if (IsControlJustPressed(0, 242)) {
        fov = Math.min(fov + 5, fov_max);
    }
    
    SetCamFov(cam, fov);
}

export const disableMovement = () => {
    DisableControlAction(2, 1,   true) 
    DisableControlAction(2, 2,   true) 
    DisableControlAction(2, 106, true) 
    DisableControlAction(2, 142, true) 
    DisableControlAction(2, 30,  true) 
    DisableControlAction(2, 31,  true) 
    DisableControlAction(2, 21,  true) 
    DisableControlAction(2, 24,  true) 
    DisableControlAction(2, 25,  true) 
    DisableControlAction(2, 47,  true) 
    DisableControlAction(2, 58,  true) 
    DisableControlAction(2, 263, true) 
    DisableControlAction(2, 264, true) 
    DisableControlAction(2, 257, true) 
    DisableControlAction(2, 140, true) 
    DisableControlAction(2, 141, true) 
    DisableControlAction(2, 143, true) 
    DisableControlAction(2, 75,  true)
    DisableControlAction(27, 75, true) 
    DisableControlAction(2, 23, true)
    DisableControlAction(2,75,true)
    DisableControlAction(2,32,true) 
    DisableControlAction(2,34,true)
    DisableControlAction(2,33,true) 
    DisableControlAction(2,35,true) 
    DisableControlAction(2,71,true) 
    DisableControlAction(2,72,true)
    DisableControlAction(2,78,true) 
    DisableControlAction(2,79,true)
}
