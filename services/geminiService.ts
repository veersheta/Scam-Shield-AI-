

import { GoogleGenAI, Type } from "@google/genai";
import { GroundingSource, AnalysisResult } from '../types';
import {
  QUICK_SCAN_MODEL,
  DEEP_ANALYSIS_MODEL,
  DEEP_ANALYSIS_PROMPT,
  QUICK_SCAN_PROMPT,
  EMAIL_ANALYSIS_PROMPT,
  URL_ANALYSIS_PROMPT,
  ANALYSIS_RESPONSE_SCHEMA
} from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Parses a Gemini API error and returns a user-friendly message.
 * @param error The error object.
 * @returns A string containing a user-friendly error message.
 */
const getGeminiError = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    if (error.message.includes('API key not valid')) {
      return 'Authentication Error: The API key is invalid. Please check your configuration.';
    }
    if (error.message.includes('400 Bad Request') || error.message.includes('invalid argument')) {
      return 'Invalid Request: The analysis request was malformed. Please check the input and try again.';
    }
    if (error.message.includes('500') || error.message.includes('internal error')) {
        return 'API Server Error: The analysis service is temporarily unavailable. Please try again later.';
    }
    if (error.message.includes('content was blocked')) {
        return 'Content Blocked: The input message was blocked by the safety filter due to its content. Please revise your message.';
    }
     if (error.message.includes('timed out')) {
        return 'Request Timeout: The analysis took too long to complete. Please check your network and try again.';
    }
    return `An API error occurred: ${error.message}`;
  }
  return 'An unknown error occurred during analysis. Please check the console for details.';
};


// FIX: Removed extractJson helper as it's no longer needed when responseMimeType is "application/json".


// FIX: Updated quickScan to use JSON mode instead of Google Search grounding to ensure a structured response, per Gemini API guidelines.
export const quickScan = async (message: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: QUICK_SCAN_MODEL,
      contents: `${QUICK_SCAN_PROMPT} "${message}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_RESPONSE_SCHEMA,
      },
    });

    const resultData = JSON.parse(response.text) as Omit<AnalysisResult, 'sources'>;

    return { ...resultData, sources: [] };
  } catch (error) {
    console.error('Error during Quick Scan:', error);
    throw new Error(getGeminiError(error));
  }
};

export const deepAnalysis = async (message: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: DEEP_ANALYSIS_MODEL,
      contents: `${DEEP_ANALYSIS_PROMPT} "${message}"`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_RESPONSE_SCHEMA,
      },
    });

    const resultData = JSON.parse(response.text) as Omit<AnalysisResult, 'sources'>;
    return { ...resultData, sources: [] }; // No sources for deep analysis
  } catch (error) {
    console.error('Error during Deep Analysis:', error);
    throw new Error(getGeminiError(error));
  }
};

export const analyzeEmail = async (sender: string, subject: string, body: string): Promise<AnalysisResult> => {
  try {
    const emailContent = `Sender: ${sender}\nSubject: ${subject}\nBody: ${body}`;
    const response = await ai.models.generateContent({
      model: QUICK_SCAN_MODEL,
      contents: `${EMAIL_ANALYSIS_PROMPT} \n\n${emailContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_RESPONSE_SCHEMA,
      },
    });

    const resultData = JSON.parse(response.text) as Omit<AnalysisResult, 'sources'>;
    return { ...resultData, sources: [] };
  } catch (error) {
    console.error('Error during Email Analysis:', error);
    throw new Error(getGeminiError(error));
  }
};

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
    try {
      const response = await ai.models.generateContent({
        model: QUICK_SCAN_MODEL,
        contents: `${URL_ANALYSIS_PROMPT} "${url}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_RESPONSE_SCHEMA,
        },
      });
  
      const resultData = JSON.parse(response.text) as Omit<AnalysisResult, 'sources'>;
      return { ...resultData, sources: [] };
    } catch (error) {
      console.error('Error during URL Analysis:', error);
      throw new Error(getGeminiError(error));
    }
  };