import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SearchResult, SearchResponse, AIProvider } from '../types';
import { searchPrompts } from './prompts';

export async function searchWithOpenAI(
  apiKey: string,
  state: string,
  county: string
): Promise<SearchResponse> {
  try {
    const openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true // Added flag to allow browser usage
    });
    const prompt = searchPrompts.openai(state, county);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const data = JSON.parse(content);
    return {
      results: Array.isArray(data.results) ? data.results.map((result: any) => ({
        id: crypto.randomUUID(),
        ...result,
        provider: 'openai',
        timestamp: new Date().toISOString(),
        validated: result.confidence > 0.8
      })) : []
    };
  } catch (error) {
    console.error('OpenAI search error:', error);
    return {
      results: [],
      error: error instanceof Error ? error.message : 'Failed to search with OpenAI'
    };
  }
}

export async function searchWithAnthropic(
  apiKey: string,
  state: string,
  county: string
): Promise<SearchResponse> {
  try {
    const anthropic = new Anthropic({ apiKey });
    const prompt = searchPrompts.anthropic(state, county);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
      temperature: 0.3
    });

    const content = response.content[0]?.text;
    if (!content) {
      throw new Error('No response from Anthropic');
    }

    const data = JSON.parse(content);
    return {
      results: Array.isArray(data.results) ? data.results.map((result: any) => ({
        id: crypto.randomUUID(),
        ...result,
        provider: 'anthropic',
        timestamp: new Date().toISOString(),
        validated: result.confidence > 0.8
      })) : []
    };
  } catch (error) {
    console.error('Anthropic search error:', error);
    return {
      results: [],
      error: error instanceof Error ? error.message : 'Failed to search with Anthropic'
    };
  }
}

export async function searchWithGemini(
  apiKey: string,
  state: string,
  county: string
): Promise<SearchResponse> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = searchPrompts['google-gemini'](state, county);
    
    const result = await model.generateContent([
      { text: prompt.system },
      { text: prompt.user }
    ]);
    const response = await result.response;
    const content = response.text();
    
    if (!content) {
      throw new Error('No response from Gemini');
    }

    const data = JSON.parse(content);
    return {
      results: Array.isArray(data.results) ? data.results.map((result: any) => ({
        id: crypto.randomUUID(),
        ...result,
        provider: 'google-gemini',
        timestamp: new Date().toISOString(),
        validated: result.confidence > 0.8
      })) : []
    };
  } catch (error) {
    console.error('Gemini search error:', error);
    return {
      results: [],
      error: error instanceof Error ? error.message : 'Failed to search with Gemini'
    };
  }
}

export async function searchWithProviders(
  providers: AIProvider[],
  state: string,
  county: string
): Promise<SearchResult[]> {
  const enabledProviders = providers.filter(p => p.enabled && p.apiKey);
  const searchPromises = enabledProviders.map(provider => {
    switch (provider.id) {
      case 'openai':
        return searchWithOpenAI(provider.apiKey!, state, county);
      case 'anthropic':
        return searchWithAnthropic(provider.apiKey!, state, county);
      case 'google-gemini':
        return searchWithGemini(provider.apiKey!, state, county);
      default:
        return Promise.resolve({ results: [] });
    }
  });

  const results = await Promise.all(searchPromises);
  return results.flatMap(r => r.results);
}