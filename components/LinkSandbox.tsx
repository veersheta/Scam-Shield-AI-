
import React, { useState, useCallback } from 'react';
import { analyzeUrl } from '../services/geminiService';
import { AnalysisResult } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';
import { MagnifyingGlassIcon, LightbulbIcon } from './icons/Icons';

const LinkSandbox: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sandboxedUrl, setSandboxedUrl] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    let fullUrl = url;
    if (!url.trim()) {
      setError('Please enter a URL to analyze.');
      return;
    }
    // Basic URL validation
    try {
        if (!/^https?:\/\//i.test(url)) {
          fullUrl = `https://${url}`;
        }
        new URL(fullUrl);
    } catch (_) {
        setError('Please enter a valid URL.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSandboxedUrl(null);

    try {
      const analysisResult = await analyzeUrl(url);
      setResult(analysisResult);
      setSandboxedUrl(fullUrl);
      setIsIframeLoading(true);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred during URL analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <section className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/20">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2 flex items-center justify-center">
          <MagnifyingGlassIcon className="h-6 w-6 mr-3 text-light-accent dark:text-dark-accent" />
          Zero-Trust Link Sandbox
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto mb-6">
          Vet suspicious URLs in a secure, isolated environment. Our AI performs static analysis to expose malicious links and phishing attempts before you click.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-grow w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none transition-colors"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Analyze URL Safely'}
          </button>
        </div>
      </form>

      <div className="max-w-3xl mx-auto">
        {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
        {result && <AnalysisResultDisplay result={result} />}
        
        {sandboxedUrl && (
          <div className="mt-8">
            <div className="flex items-start p-4 mb-4 bg-yellow-400/10 border border-yellow-400/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
              <LightbulbIcon className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold">A Note on Previews</h4>
                <p className="text-sm mt-1">
                  For your protection, many secure websites (especially banks or login pages) will block being loaded in a preview frame. A "refused to connect" error is often a sign of the website's own security features, not a bug. The AI analysis provides the primary risk assessment.
                </p>
              </div>
            </div>

            <h4 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary text-center mb-4">Safe Preview</h4>
            <div className="relative p-1.5 bg-black rounded-lg ring-2 ring-light-border dark:ring-dark-border aspect-video shadow-lg">
              {isIframeLoading && (
                <div className="absolute inset-0 bg-white dark:bg-dark-bg flex items-center justify-center z-10">
                    <svg className="animate-spin h-8 w-8 text-light-accent dark:text-dark-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
              )}
              <iframe
                src={sandboxedUrl}
                sandbox="allow-forms allow-scripts allow-same-origin"
                title="Safe URL Sandbox"
                className="w-full h-full bg-white border-0 rounded-sm"
                onLoad={() => setIsIframeLoading(false)}
                onError={() => setIsIframeLoading(false)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LinkSandbox;