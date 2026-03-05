import VueGtag from 'vue-gtag'

export default {
    install: (app, router) => {
        const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

        // Skip in dev or if no ID
        if (import.meta.env.DEV || !measurementId) {
            console.warn('GA disabled in development or no ID provided')
            return
        }

        app.use(VueGtag, {
            config: { id: measurementId },
            appName: 'My Vue App',           // optional – shows in GA
            pageTrackerScreenviewEnabled: true,
        }, router)

        // Optional: auto-track page views on route change
        // (vue-gtag already does this when router is passed)
    }
}