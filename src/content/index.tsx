import ReactDOM from 'react-dom/client';
import widgetCss from './widget.css?inline';
import { FloatingWidget, FloatingWidgetProps } from '../features/widget/FloatingWidget';
import { initFileInterceptor } from '../features/interceptor/fileInterceptor';

const HOST_ID = 'filefit-extension-host';

function setupShadowHost(): {
  shadowRoot: ShadowRoot;
  mountNode: HTMLDivElement;
} {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    // Ensure host element doesn't interfere with page layout or pointer events when idle
    host.style.position = 'fixed';
    host.style.bottom = '0';
    host.style.right = '0';
    host.style.zIndex = '2147483647';
    host.style.pointerEvents = 'none';
    document.documentElement.appendChild(host);
  }

  let shadowRoot = host.shadowRoot;
  if (!shadowRoot) {
    shadowRoot = host.attachShadow({ mode: 'open' });

    // Inject isolated styles directly into shadow root
    const styleEl = document.createElement('style');
    styleEl.textContent = widgetCss;
    shadowRoot.appendChild(styleEl);

    // Host rem trap prevention: ensure base font-size is strictly locked
    const resetStyle = document.createElement('style');
    resetStyle.textContent = `
      :host {
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
    `;
    shadowRoot.appendChild(resetStyle);
  }

  let mountNode = shadowRoot.querySelector('#filefit-mount') as HTMLDivElement | null;
  if (!mountNode) {
    mountNode = document.createElement('div');
    mountNode.id = 'filefit-mount';
    mountNode.style.pointerEvents = 'auto';
    shadowRoot.appendChild(mountNode);
  }

  return { shadowRoot, mountNode };
}

function initContentScript() {
  const { mountNode } = setupShadowHost();
  const root = ReactDOM.createRoot(mountNode);

  // Initialize global file interceptor
  initFileInterceptor((props: FloatingWidgetProps | null) => {
    if (!props) {
      root.render(null);
    } else {
      root.render(<FloatingWidget {...props} />);
    }
  });

  console.log('[FileFit] Content script active & ready.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}
