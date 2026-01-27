import Webamp from 'webamp'

const startWebamp = () => {
    if (Webamp.browserIsSupported()) {
        const webamp = new Webamp({
            initialTracks: [{
                metaData: {
                    artist: "Microsoft",
                    title: "Windows 95 Startup"
                },
                url: `${process.env.PUBLIC_URL}/win95startup.mp3`,
                duration: 7
            }]
        });
        webamp.onClose(() => {
            webamp.dispose();
        })

        webamp.renderWhenReady(document.getElementById('winamp-container'));

    }
}

export { startWebamp } 