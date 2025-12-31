import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract all text content from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromArrayBuffer(arrayBuffer);
}

/**
 * Extract text from a PDF given its ArrayBuffer
 */
export async function extractTextFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n\n');
}

/**
 * Extract text from a PDF URL
 */
export async function extractTextFromURL(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return extractTextFromArrayBuffer(arrayBuffer);
}

/**
 * Parse job description to extract key skills and requirements
 */
export function parseJobDescription(text: string): {
  skills: string[];
  requirements: string[];
  experience: string[];
} {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const skillKeywords = [
    'react', 'vue', 'angular', 'typescript', 'javascript', 'python', 'node',
    'flask', 'django', 'fastapi', 'sql', 'postgresql', 'mongodb', 'redis',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'ci/cd',
    'machine learning', 'ai', 'ml', 'deep learning', 'nlp', 'llm',
    'three.js', 'webgl', 'opengl', 'vtk', 'cfd', 'simulation',
    'rest', 'api', 'graphql', 'microservices', 'agile', 'scrum',
    'tailwind', 'css', 'html', 'figma', 'responsive', 'mobile',
    'react native', 'expo', 'ios', 'android', 'flutter',
    'langchain', 'chromadb', 'vector', 'rag', 'embeddings',
    'next.js', 'vite', 'webpack', 'testing', 'jest', 'pytest'
  ];

  const textLower = text.toLowerCase();
  
  const foundSkills = skillKeywords.filter(skill => 
    textLower.includes(skill.toLowerCase())
  );

  // Extract experience requirements (years)
  const experienceMatches = text.match(/(\d+\+?\s*(?:years?|yrs?))/gi) || [];
  
  // Extract bullet points as requirements
  const requirements = lines
    .filter(line => /^[-•*]\s/.test(line) || /^\d+\.\s/.test(line))
    .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
    .slice(0, 10);

  return {
    skills: [...new Set(foundSkills)],
    requirements,
    experience: [...new Set(experienceMatches)]
  };
}

/**
 * Match parsed job requirements against a skill profile
 */
export function matchSkills(
  jobSkills: string[],
  profileSkills: string[]
): {
  matched: string[];
  missing: string[];
  score: number;
} {
  const profileLower = profileSkills.map(s => s.toLowerCase());
  
  const matched = jobSkills.filter(skill => 
    profileLower.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
  );
  
  const missing = jobSkills.filter(skill => 
    !profileLower.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
  );

  const score = jobSkills.length > 0 
    ? Math.round((matched.length / jobSkills.length) * 100) 
    : 0;

  return { matched, missing, score };
}
