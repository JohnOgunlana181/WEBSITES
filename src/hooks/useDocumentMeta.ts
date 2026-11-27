import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | null;
}

export function useDocumentMeta({ title, description, jsonLd }: MetaOptions) {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const existingScript = document.getElementById('dynamic-page-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'dynamic-page-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const cleanup = document.getElementById('dynamic-page-jsonld');
      if (cleanup) cleanup.remove();
    };
  }, [title, description, jsonLd]);
}
