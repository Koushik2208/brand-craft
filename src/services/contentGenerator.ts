export interface GeneratedContent {
  main_topic: string;
  generated_topic: string;
  platforms: {
    instagram: {
      post_type: string;
      content: string[];
      cta: string;
    };
    x: {
      post_type: string;
      content: string;
      cta: string;
    };
    linkedin: {
      post_type: string;
      content: string;
      cta: string;
    };
  };
}

export async function generateContent(topicsOfInterest: string[]): Promise<GeneratedContent> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const prompt = `The user has provided the following topics of interest during onboarding: ${topicsOfInterest.join(', ')}

Step 1: Generate ONE concise subtopic derived from these topics (do not create unrelated topics).

Step 2: Using that subtopic, generate platform-specific content for:

1. Instagram – carousel-style text (3–5 slides, short, punchy, educational, slightly emotional to increase engagement)
2. X (Twitter) – concise, scroll-stopping tweet with curiosity or value hook
3. LinkedIn – slightly longer, professional, value-driven post (paragraph form)

Step 3: For each platform, include a short CTA for the user to take action (optional but encouraged).

Do NOT include hashtags or emojis unless they clarify. Keep the tone professional, relatable, and consistent with personal branding.

Output only valid JSON in the exact format:

{
  "main_topic": "<one of the user's provided topics>",
  "generated_topic": "<concise subtopic related to main_topic>",
  "platforms": {
    "instagram": {
      "post_type": "instagram_carousel",
      "content": ["Slide 1: ...","Slide 2: ...","Slide 3: ..."],
      "cta": "..."
    },
    "x": {
      "post_type": "x_tweet",
      "content": "...",
      "cta": "..."
    },
    "linkedin": {
      "post_type": "linkedin_post",
      "content": "...",
      "cta": "..."
    }
  }
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content creator specializing in personal branding. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);

  return content;
}
