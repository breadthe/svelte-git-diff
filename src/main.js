import App from './App.svelte';
import "../public/global.css";

const app = new App({
    target: document.body,
    props: {
        title: 'GitHub Diff',
        subtitle: 'Compare changes across GitHub branches, commits, or tags'
    }
});

export default app;
