const wakeLockSwitch = document.querySelector('#wakelock');
const wakeLockStatus = document.querySelector('#wakelock-status');

const changeUI = status => {
    const acquired = status === 'acquired';
    wakeLockSwitch.checked = acquired;
}

let isSupported = false;
if ('wakeLock' in navigator && true) {
    isSupported = true;
} else {
    wakeLockSwitch.disabled = true;
    wakeLockStatus.textContent = 'Wake lock is not supported by your browser';
}

if (isSupported) {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            
            changeUI('acquired');

            wakeLock.onrelease = (ev) => {
                console.log(ev);
            }

            wakeLock.addEventListener('release', () => {
                changeUI('release');
            });
        } catch (err) {
            wakeLockSwitch.value = 'off';
        }
    }

    wakeLockSwitch.addEventListener('click', () => {
        if (wakeLockSwitch.checked) {
            requestWakeLock();
        } else {
            wakeLock.release()
                .then(() => {
                    wakeLock = null;
                });
        }
    });

    requestWakeLock();

    document.addEventListener('visibilitychange', () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });
}
