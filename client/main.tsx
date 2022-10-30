export const template = (text: string, dark: boolean) => {
  return (
    <>
      <head lang='en'>
        <title>notebok</title>
        <link rel='stylesheet' href='/client/styles/main.css' />
        <link rel='icon' href='/client/assets/favicon.svg' />

        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='UTF-8' />

        <meta property='og:title' content='notebok' />
        <meta property='og:description' content='A small zen mode notebook' />
      </head>
      <body class={dark ? 'dark' : ''}>
        <main id='container'>
          <div id='theme'></div>
          <textarea
            id='text'
            placeholder='Just start typing...'
          >
            {text}
          </textarea>
          <h1 id='counter'>
            {`${text.length}, ${text.split(/\s+/).filter(Boolean).length}`}
          </h1>
        </main>
        <script src='/client/build/main.js' type='module'></script>
      </body>
    </>
  );
};
