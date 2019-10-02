export function head_script(src) {
    if (document.querySelector("script[src='" + src + "']")) { return; }
    let script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script)
}