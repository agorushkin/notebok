import { WebServer } from 'https://agorushkin.deno.dev/modules/http-server';

import { file } from './src/file.ts';

const server = new WebServer();

const texts: Record<string, string> = {};
const themes: Record<string, string> = {};

server.use('/')(({ respond }) => {
    respond({ status: 302, headers: { Location: `/${ crypto.randomUUID() }` } });
});

server.use('/:uuid')(async ({ respond, params }) => {
    const uuid = params.uuid;
    const html = await file('./client/main.html');

    if (html) {
        const text = texts[uuid] || '';
        const theme = themes[uuid] || 'light';
        let editedHTML = html;

        if (theme == 'dark') editedHTML = editedHTML.replace('<body>', '<body class="dark">');
        editedHTML = editedHTML.replace('{{ text }}', text);
        respond({ body: editedHTML, headers: { 'Content-Type': 'text/html' } });
    } else respond({ status: 404 });
});

server.use('/save/:uuid', 'POST')(async ({ body, params, href }) => {
    const query = new URLSearchParams(href.split('?')[1]);
    const theme = query.get('theme') == 'dark' ? 'dark' : 'light';
    const text = await body.text();
    const uuid = params.uuid;

    texts[uuid] = text;
    themes[uuid] = theme;
});

server.static('/client', './client');
server.open(8080);