import type { FAQ, MatchResult, RulesConfig } from './types';

const TURKISH_CHAR_MAP: Record<string, string> = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
};

function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  
  // Remove Turkish characters if needed
  Object.entries(TURKISH_CHAR_MAP).forEach(([from, to]) => {
    normalized = normalized.replace(new RegExp(from, 'g'), to);
  });
  
  // Remove punctuation
  normalized = normalized.replace(/[.,!?;:()\[\]{}"']/g, ' ');
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

function removeStopwords(text: string, stopwords: string[]): string[] {
  const tokens = text.split(' ');
  return tokens.filter(token => 
    token.length > 0 && !stopwords.includes(token)
  );
}

function expandKeywordsWithSynonyms(
  keywords: string[],
  synonymGroups: Record<string, string[]>
): Set<string> {
  const expanded = new Set(keywords);
  
  keywords.forEach(keyword => {
    // Check if keyword is in any synonym group
    Object.entries(synonymGroups).forEach(([root, synonyms]) => {
      if (synonyms.includes(keyword) || root === keyword) {
        expanded.add(root);
        synonyms.forEach(syn => expanded.add(syn));
      }
    });
  });
  
  return expanded;
}

function calculateScore(
  tokens: string[],
  faq: FAQ,
  config: RulesConfig
): MatchResult['matchDetails'] & { score: number } {
  const expandedKeywords = expandKeywordsWithSynonyms(
    faq.keywords,
    config.synonymGroups
  );
  
  let score = 0;
  let exactMatches = 0;
  let synonymMatches = 0;
  let categoryMatch = false;
  
  // Check exact keyword matches (+2 points each)
  tokens.forEach(token => {
    if (faq.keywords.includes(token)) {
      score += 2;
      exactMatches++;
    }
    // Check synonym matches (+1 point each)
    else if (expandedKeywords.has(token) && !faq.keywords.includes(token)) {
      score += 1;
      synonymMatches++;
    }
  });
  
  // Check category match (+1 point)
  const categoryTokens = config.normalize 
    ? normalizeText(faq.category).split(' ')
    : faq.category.toLowerCase().split(' ');
  
  if (tokens.some(token => categoryTokens.includes(token))) {
    score += 1;
    categoryMatch = true;
  }
  
  return { score, exactMatches, synonymMatches, categoryMatch };
}

export function matchMessage(
  text: string,
  faqs: FAQ[],
  config: RulesConfig
): MatchResult {
  // 1. Normalize text
  const normalized = config.normalize ? normalizeText(text) : text.toLowerCase();
  
  // 2. Remove stopwords
  const tokens = removeStopwords(normalized, config.stopwords);
  
  // 3. Score each FAQ
  const results = faqs.map(faq => {
    const { score, exactMatches, synonymMatches, categoryMatch } = 
      calculateScore(tokens, faq, config);
    
    const matchedKeywords = faq.keywords.filter(keyword =>
      tokens.includes(config.normalize ? normalizeText(keyword) : keyword.toLowerCase())
    );
    
    return {
      faqId: faq.id,
      score,
      matchedKeywords,
      matchDetails: {
        exactMatches,
        synonymMatches,
        categoryMatch
      }
    };
  });
  
  // 4. Sort by score and return best match
  results.sort((a, b) => b.score - a.score);
  
  const best = results[0];
  
  // Return match if score >= minScore, otherwise null
  if (best && best.score >= config.minScore) {
    return best;
  }
  
  return {
    faqId: null,
    score: 0,
    matchedKeywords: [],
    matchDetails: {
      exactMatches: 0,
      synonymMatches: 0,
      categoryMatch: false
    }
  };
}

export function matchAllFAQs(
  text: string,
  faqs: FAQ[],
  config: RulesConfig
): Array<MatchResult & { faq: FAQ }> {
  const normalized = config.normalize ? normalizeText(text) : text.toLowerCase();
  const tokens = removeStopwords(normalized, config.stopwords);
  
  const results = faqs.map(faq => {
    const { score, exactMatches, synonymMatches, categoryMatch } = 
      calculateScore(tokens, faq, config);
    
    const matchedKeywords = faq.keywords.filter(keyword =>
      tokens.includes(config.normalize ? normalizeText(keyword) : keyword.toLowerCase())
    );
    
    return {
      faqId: faq.id,
      faq,
      score,
      matchedKeywords,
      matchDetails: {
        exactMatches,
        synonymMatches,
        categoryMatch
      }
    };
  });
  
  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

export async function callLLM(message: string): Promise<string> {
  // MOCK: Simulate LLM API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Replace with real LLM API call
  // const response = await fetch('/api/llm/generate', {
  //   method: 'POST',
  //   body: JSON.stringify({ message })
  // });
  
  return `Bu sorunuz hakkında kesin bir cevabım yok, ancak size yardımcı olmaya çalışayım. "${message}" ile ilgili daha fazla bilgi verebilir misiniz? Böylece size daha iyi yardımcı olabilirim.`;
}
