import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const MarkdownRenderer = ({ content }) => {
  const getSafeHtml = useMemo(() => {
    try {
      // Parse markdown to HTML
      const rawHtml = marked(content || '');
      // Sanitize the HTML to prevent XSS
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'code', 'pre', 'blockquote'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      });
      return { __html: cleanHtml };
    } catch (error) {
      console.error("Error rendering markdown:", error);
      return { __html: "Error rendering content." };
    }
  }, [content]);

  return (
    <div 
      className="markdown-body" 
      dangerouslySetInnerHTML={getSafeHtml} 
    />
  );
};

export default MarkdownRenderer;
