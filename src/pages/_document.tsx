import { Head, Html, Main, NextScript } from 'next/document';

export default function document() {
    return (
        <Html>
            <title>{'Space ship 🧨  ->  🚀'}</title>
            <Head>
                <meta name="description" content="To space!... i guess" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:image" content="/icon.png" />
                <meta name="theme-color" content="#f54251" />
                <meta name="twitter:card" content="summary_large_image"></meta>
            </Head>
            <body className="bg-zinc-900">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
