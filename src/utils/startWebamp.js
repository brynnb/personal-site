import Webamp from 'webamp'

let webampInstance = null;

const startWebamp = () => {
    if (webampInstance) {
        return;
    }

    if (Webamp.browserIsSupported()) {
        webampInstance = new Webamp({
            initialTracks: [{
                metaData: {
                    artist: "Microsoft",
                    title: "Windows 95 Startup"
                },
                url: `${process.env.PUBLIC_URL}/win95startup.mp3`,
                duration: 7
            }]
        });

        webampInstance.onClose(() => {
            webampInstance.dispose();
            webampInstance = null;
        })

        webampInstance.renderWhenReady(document.getElementById('winamp-container'));
    }
}

export { startWebamp } 